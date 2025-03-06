import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseURL } from "./axios";

export class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.callback = null;
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.isManuallyDisconnected = false;
  }

  connect(topic, onMessage) {
    if (this.stompClient?.connected) return;

    this.isManuallyDisconnected = false;
    this.reconnectAttempts = 0;
    this.callback = onMessage;

    try {
      const socket = new SockJS(`${baseURL}sensor-data-websocket`);
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {};

      this.callback?.({
        type: "status",
        value: "Connecting",
        attempt: this.reconnectAttempts + 1,
        maxAttempts: this.maxReconnectAttempts,
      });

      this.stompClient.connect(
        {},
        () => {
          console.log("Connected to STOMP");
          this.reconnectAttempts = 0;
          this.callback?.({ type: "status", value: "Connected" });

          this.stompClient.subscribe(
            topic,
            (message) => {
              try {
                const data = JSON.parse(message.body);
                this.callback?.({ type: "data", value: data });
              } catch (error) {
                console.error("Error parsing message:", error);
              }
            },
            {
              ack: "auto",
            }
          );

          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
        },
        (error) => {
          console.error("STOMP connection error:", error);
          this.handleConnectionError(error);
        }
      );
    } catch (error) {
      console.error("Connection error:", error);
      this.handleConnectionError(error);
    }
  }

  handleConnectionError(error) {
    if (this.isManuallyDisconnected) {
      this.callback?.({
        type: "status",
        value: "Disconnected",
        error: error?.message,
      });
      return;
    }

    this.reconnectAttempts++;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.callback?.({
        type: "status",
        value: "Reconnecting",
        attempt: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts,
        error: error?.message,
      });
      this.scheduleReconnection();
    } else {
      this.callback?.({
        type: "status",
        value: "Failed",
        error:
          "Maximum reconnection attempts reached. Please try again manually.",
        canRetry: true,
      });
    }
  }

  scheduleReconnection() {
    if (!this.reconnectTimeout) {
      const delay = Math.min(
        2000 * Math.pow(2, this.reconnectAttempts - 1),
        10000
      );

      this.reconnectTimeout = setTimeout(() => {
        this.reconnectTimeout = null;
        this.connect();
      }, delay);
    }
  }

  retry() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  disconnect() {
    this.isManuallyDisconnected = true;

    if (this.stompClient?.connected) {
      try {
        this.stompClient.disconnect(() => {
          console.log("Disconnected from STOMP");
          this.callback?.({ type: "status", value: "Disconnected" });
        });
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
      this.stompClient = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.callback = null;
  }
}

