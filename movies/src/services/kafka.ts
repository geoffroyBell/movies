import { Kafka, Producer, Consumer } from "kafkajs";

export class KafkaService {
  private kafka: Kafka;
  private producer?: Producer;
  private consumer?: Consumer;

  constructor(
    options: { enableProducer?: boolean; enableConsumer?: boolean } = {}
  ) {
    this.kafka = new Kafka({
      clientId: "accounts-service",
      brokers: ["broker:29092"], // À modifier selon votre configuration
    });

    if (options.enableProducer) {
      this.producer = this.kafka.producer();
    }
    if (options.enableConsumer) {
      this.consumer = this.kafka.consumer({ groupId: "accounts-group" });
    }
  }

  async connect() {
    try {
      if (this.producer) {
        await this.producer.connect();
      }
      if (this.consumer) {
        await this.consumer.connect();
      }
      console.log("Connecté à Kafka avec succès");
    } catch (error) {
      console.error("Erreur de connexion à Kafka:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
      }
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      console.log("Déconnecté de Kafka avec succès");
    } catch (error) {
      console.error("Erreur de déconnexion de Kafka:", error);
      throw error;
    }
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer?.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  async subscribe(topic: string, callback: (message: any) => Promise<void>) {
    try {
      await this.consumer?.subscribe({ topic, fromBeginning: true });
      await this.consumer?.run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (value) {
            await callback(JSON.parse(value));
          }
        },
      });
    } catch (error) {
      console.error("Erreur lors de la souscription:", error);
      throw error;
    }
  }
}
