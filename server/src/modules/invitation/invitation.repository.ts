import prisma from '../../lib/prisma.js';
import { InvitationStatus } from '../../generated/prisma/client.js';

export class InvitationRepository {
  private getClient(tx?: any) {
    return tx || prisma;
  }

  /**
   * Creates an invitation.
   */
  public async create(
    activityId: string,
    invitedUserId: string,
    invitedById: string,
    message?: string,
    expiresAt?: Date,
    tx?: any
  ) {
    return this.getClient(tx).activityInvitation.create({
      data: {
        activityId,
        invitedUserId,
        invitedById,
        message: message ?? null,
        expiresAt: expiresAt ?? null,
        status: InvitationStatus.PENDING,
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            startsAt: true,
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Finds an invitation by ID.
   */
  public async findById(id: string, tx?: any) {
    return this.getClient(tx).activityInvitation.findUnique({
      where: { id },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            organizerId: true,
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Finds a pending invitation.
   */
  public async findPending(activityId: string, invitedUserId: string, tx?: any) {
    return this.getClient(tx).activityInvitation.findFirst({
      where: {
        activityId,
        invitedUserId,
        status: InvitationStatus.PENDING,
      },
    });
  }

  /**
   * Finds all invitations for an activity.
   */
  public async findByActivity(activityId: string, tx?: any) {
    return this.getClient(tx).activityInvitation.findMany({
      where: { activityId },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            startsAt: true,
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds invitations received by a user.
   */
  public async findByInvitedUser(userId: string, tx?: any) {
    return this.getClient(tx).activityInvitation.findMany({
      where: { invitedUserId: userId },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            startsAt: true,
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Updates invitation status.
   */
  public async updateStatus(id: string, status: InvitationStatus, tx?: any) {
    const data: any = { status };
    if (status !== InvitationStatus.PENDING) {
      data.respondedAt = new Date();
    }
    return this.getClient(tx).activityInvitation.update({
      where: { id },
      data,
    });
  }

  /**
   * Upserts participant record on acceptance.
   */
  public async upsertParticipant(activityId: string, userId: string, tx?: any) {
    const client = this.getClient(tx);
    const existing = await client.activityParticipant.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
      },
    });

    if (existing) {
      return client.activityParticipant.update({
        where: { id: existing.id },
        data: {
          status: 'ACCEPTED',
          role: 'PARTICIPANT',
        },
      });
    }

    return client.activityParticipant.create({
      data: {
        activityId,
        userId,
        role: 'PARTICIPANT',
        status: 'ACCEPTED',
      },
    });
  }
}

export const invitationRepository = new InvitationRepository();
export default invitationRepository;
