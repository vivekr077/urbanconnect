export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },
  user: {
    profile: (id: string) => ["user", id],
  },
  activity: {
    all: ["activities"],
    detail: (id: string) => ["activities", id],
    nearby: ["activities", "nearby"],
  },
  participant: {
    list: (activityId: string) => ["participants", activityId],
    pending: (activityId: string) => ["participants", "pending", activityId],
    me: (activityId: string) => ["participants", "me", activityId],
  },
  invitation: {
    received: ["invitations", "received"],
    sent: (activityId: string) => ["invitations", "sent", activityId],
  },
};
