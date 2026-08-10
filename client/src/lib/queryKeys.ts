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
  },
  invitation: {
    received: ["invitations", "received"],
    sent: (id: string) => ["invitations", id],
  },
};
