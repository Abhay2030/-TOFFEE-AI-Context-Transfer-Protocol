import { FastifyReply } from 'fastify';

class SSEService {
  // Map of userId to a Set of active FastifyReply streams
  private clients = new Map<string, Set<FastifyReply>>();

  /**
   * Register a new client for a specific user
   */
  addClient(userId: string, reply: FastifyReply) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(reply);

    // Send an initial connected event
    this.sendToReply(reply, 'connected', { status: 'established', timestamp: Date.now() });

    // Keep connection alive with periodic pings
    const pingInterval = setInterval(() => {
      this.sendToReply(reply, 'ping', { timestamp: Date.now() });
    }, 30000);

    // Clean up when the client closes the connection
    reply.raw.on('close', () => {
      clearInterval(pingInterval);
      this.removeClient(userId, reply);
    });
  }

  /**
   * Remove a disconnected client
   */
  private removeClient(userId: string, reply: FastifyReply) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(reply);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Broadcast an event to all active connections for a specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      for (const reply of userClients) {
        this.sendToReply(reply, event, data);
      }
    }
  }

  /**
   * Write SSE payload to the raw Node.js ServerResponse
   */
  private sendToReply(reply: FastifyReply, event: string, data: any) {
    // Standard Server-Sent Events format
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    try {
      reply.raw.write(payload);
    } catch (err) {
      // Ignore write errors (e.g. client just disconnected)
    }
  }
}

export const sseService = new SSEService();
