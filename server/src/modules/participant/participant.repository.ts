import prisma from '../../lib/prisma.js';
import { ParticipantStatus } from '../../generated/prisma/client.js';

export class ParticipantRepository {
  /**
   * Creates a join request.
   */
  public async createJoinRequest(activityId: string, userId: string, status: ParticipantStatus) {
    return prisma.activityParticipant.create({
      data: {
        activityId,
        userId,
        role: 'PARTICIPANT',
        status,
      },
    });
  }

  /**
   * Re-requests to join (e.g. if they previously left, we update status to pending/accepted).
   */
  public async updateRequestStatus(id: string, status: ParticipantStatus) {
    return prisma.activityParticipant.update({
      where: { id },
      data: {
        status,
        requestedAt: new Date(),
        approvedAt: null,
        approvedById: null,
      },
    });
  }

  /**
   * Finds participant row matching activityId and userId.
   */
  public async findParticipant(activityId: string, userId: string) {
    return prisma.activityParticipant.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            trustScore: true,
          },
        },
      },
    });
  }

  /**
   * Finds participant row by its UUID.
   */
  public async findParticipantById(id: string) {
    return prisma.activityParticipant.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            trustScore: true,
          },
        },
      },
    });
  }

  /**
   * Updates status of participant request (accept/reject/leave).
   */
  public async updateStatus(id: string, status: ParticipantStatus, approvedById?: string) {
    const data: any = { status };
    if (status === ParticipantStatus.ACCEPTED) {
      data.approvedAt = new Date();
      data.approvedById = approvedById || null;
    } else {
      data.approvedAt = null;
      data.approvedById = null;
    }

    return prisma.activityParticipant.update({
      where: { id },
      data,
    });
  }

  /**
   * Lists all participants for an activity with a specific status.
   */
  public async listParticipants(activityId: string, status: ParticipantStatus) {
    return prisma.activityParticipant.findMany({
      where: {
        activityId,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'asc',
      },
    });
  }

  /**
   * Removes a participant request completely from the database.
   */
  public async deleteParticipant(id: string) {
    return prisma.activityParticipant.delete({
      where: { id },
    });
  }
}

export const participantRepository = new ParticipantRepository();
export default participantRepository;
