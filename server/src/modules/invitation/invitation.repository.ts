import prisma from '../../lib/prisma.js';
import { InvitationStatus, ParticipantRole, ParticipantStatus } from '../../generated/prisma/client.js';
import type { ListInvitationQuery } from './invitation.types.js';

export class InvitationRepository {
  public async create(
    activityId: string,
    invitedUserId: string,
    invitedById: string,
    message: string | null | undefined,
    expiresAt: Date | null | undefined,
    tx?: any
  ) {
    const client = tx || prisma;
    return client.activityInvitation.create({
      data: {
        activityId,
        invitedUserId,
        invitedById,
        status: InvitationStatus.PENDING,
        message: message || null,
        expiresAt: expiresAt || null,
      },
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  }

  public async findInvitationById(id: string, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.findUnique({
      where: { id },
      include: {
        activity: {
          include: {
            participants: {
              where: {
                status: ParticipantStatus.ACCEPTED,
              },
            },
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  }

  public async findPendingInvitation(activityId: string, invitedUserId: string, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.findFirst({
      where: {
        activityId,
        invitedUserId,
        status: InvitationStatus.PENDING,
      },
    });
  }

  public async findInvitationByActivityAndUser(activityId: string, invitedUserId: string, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.findUnique({
      where: {
        activityId_invitedUserId: {
          activityId,
          invitedUserId,
        },
      },
    });
  }

  public async updateInvitation(
    id: string,
    data: {
      status: InvitationStatus;
      message: string | null;
      expiresAt: Date | null;
      respondedAt: Date | null;
      invitedById: string;
    },
    tx?: any
  ) {
    const client = tx || prisma;
    return client.activityInvitation.update({
      where: { id },
      data,
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  }

  public async findByActivity(activityId: string, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.findMany({
      where: { activityId },
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findByInvitedUser(userId: string, queryOptions: ListInvitationQuery, tx?: any) {
    const client = tx || prisma;
    const page = queryOptions.page || 1;
    const limit = queryOptions.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { invitedUserId: userId };
    if (queryOptions.status) {
      where.status = queryOptions.status as InvitationStatus;
    }

    return client.activityInvitation.findMany({
      where,
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findActivityById(activityId: string, tx?: any) {
    const client = tx || prisma;
    return client.activity.findUnique({
      where: { id: activityId },
      include: {
        participants: {
          where: {
            status: ParticipantStatus.ACCEPTED,
          },
        },
      },
    });
  }

  public async findUserById(userId: string, tx?: any) {
    const client = tx || prisma;
    return client.user.findUnique({
      where: { id: userId },
    });
  }

  public async findParticipantByActivityAndUser(activityId: string, userId: string, tx?: any) {
    const client = tx || prisma;
    return client.activityParticipant.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
      },
    });
  }

  public async updateStatus(id: string, status: InvitationStatus, respondedAt: Date, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.update({
      where: { id },
      data: {
        status,
        respondedAt,
      },
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  }

  public async cancel(id: string, respondedAt: Date, tx?: any) {
    const client = tx || prisma;
    return client.activityInvitation.update({
      where: { id },
      data: {
        status: InvitationStatus.CANCELLED,
        respondedAt,
      },
      include: {
        activity: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        invitedUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });
  }

  public async createParticipant(
    activityId: string,
    userId: string,
    role: ParticipantRole,
    status: ParticipantStatus,
    tx?: any
  ) {
    const client = tx || prisma;
    return client.activityParticipant.create({
      data: {
        activityId,
        userId,
        role,
        status,
      },
    });
  }

  public async updateParticipant(id: string, status: ParticipantStatus, tx?: any) {
    const client = tx || prisma;
    return client.activityParticipant.update({
      where: { id },
      data: {
        status,
        requestedAt: new Date(),
        approvedAt: status === ParticipantStatus.ACCEPTED ? new Date() : null,
      },
    });
  }
}

export const invitationRepository = new InvitationRepository();
export default invitationRepository;
