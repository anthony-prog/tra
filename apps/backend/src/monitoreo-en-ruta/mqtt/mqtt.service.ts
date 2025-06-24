import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';

export interface MqttOptions {
  host: string;
  port: number;
  clientId: string;
  clean: boolean;
  connectTimeout: number;
  reconnectPeriod: number;
}

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: MqttClient | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 5000; // 5 segundos
  private readonly options: MqttOptions;
  private mqttAvailable = false;

  constructor() {
    this.options = {
      host: process.env.MQTT_HOST || 'localhost',
      port: parseInt(process.env.MQTT_PORT || '1883'),
      clientId: `transporte-api-${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };
  }

  /**
   * Intenta conectarse al broker MQTT al iniciar el módulo
   */
  onModuleInit() {
    this.tryConnect();
  }

  /**
   * Intenta conectarse al broker MQTT
   */
  private tryConnect() {
    const { host, port, ...options } = this.options;
    const url = `mqtt://${host}:${port}`;

    try {
      this.mqttClient = connect(url, options);

      this.mqttClient.on('connect', () => {
        this.isConnected = true;
        this.mqttAvailable = true;
        this.reconnectAttempts = 0;
        this.logger.log('Conectado al broker MQTT');
      });

      this.mqttClient.on('error', (err) => {
        this.logger.error('Error en conexión MQTT:', err);
        this.mqttAvailable = false;
        this.handleReconnect();
      });

      this.mqttClient.on('close', () => {
        this.isConnected = false;
        this.mqttAvailable = false;
        this.logger.warn('Conexión MQTT cerrada');
        this.handleReconnect();
      });

      this.mqttClient.on('offline', () => {
        this.isConnected = false;
        this.mqttAvailable = false;
        this.logger.warn('Cliente MQTT desconectado');
        this.handleReconnect();
      });
    } catch (error) {
      this.logger.error('Error inicializando MQTT:', error);
      this.mqttClient = null;
      this.mqttAvailable = false;
    }
  }

  /**
   * Maneja la reconexión al broker MQTT
   */
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.logger.log(
        `Intentando reconectar (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );
      setTimeout(() => {
        if (!this.isConnected) {
          this.tryConnect();
        }
      }, this.reconnectInterval);
    } else {
      this.logger.error('Número máximo de intentos de reconexión alcanzado');
      this.mqttAvailable = false;
    }
  }

  /**
   * Desconecta el cliente MQTT al destruir el módulo
   */
  onModuleDestroy() {
    this.disconnect();
  }

  /**
   * Desconecta el cliente MQTT
   */
  disconnect(): void {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
  }

  /**
   * Suscribe a un tema MQTT
   * @param topic - El tema MQTT a suscribirse
   * @param callback - La función que se ejecutará cuando se reciba un mensaje
   */
  subscribe<T>(topic: string, callback: (data: T) => void): void {
    if (!this.mqttAvailable) {
      this.logger.log('[MQTT] No disponible. Usando HTTP como fallback.');
      return;
    }

    if (!this.isConnected || !this.mqttClient) {
      this.logger.warn(
        '[MQTT] No conectado al broker. La suscripción se intentará cuando se establezca la conexión.',
      );
      return;
    }

    this.mqttClient.on('message', (receivedTopic, message) => {
      const topicPattern = new RegExp('^' + topic.replace('+', '[^/]+') + '$');
      if (topicPattern.test(receivedTopic)) {
        try {
          const data = JSON.parse(message.toString()) as T;
          callback(data);
        } catch (error) {
          this.logger.error(
            `[MQTT] Error procesando mensaje de ${receivedTopic}:`,
            error,
          );
        }
      }
    });

    this.mqttClient.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`[MQTT] Error suscribiéndose a ${topic}:`, err);
      }
    });
  }

  /**
   * Publica un mensaje en un tema MQTT
   * @param topic - El tema MQTT en el que se publicará el mensaje
   * @param data - El mensaje a publicar
   */
  publish<T>(topic: string, data: T): void {
    if (!this.mqttAvailable) {
      this.logger.debug('MQTT no disponible. Usando HTTP como fallback.');
      return;
    }

    if (!this.isConnected || !this.mqttClient) {
      this.logger.warn(
        'No conectado al broker MQTT. No se puede publicar el mensaje.',
      );
      return;
    }
    this.mqttClient.publish(topic, JSON.stringify(data));
  }

  /**
   * Verifica si el cliente MQTT está disponible
   * @returns true si el cliente MQTT está disponible, false en caso contrario
   */
  isMqttAvailable(): boolean {
    return this.mqttAvailable;
  }
}
