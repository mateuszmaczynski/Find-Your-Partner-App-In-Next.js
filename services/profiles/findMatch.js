import { user, filter as filterModel, profileCheck } from 'models';

const checkedIds = async (userId) => {
  const profiles = await profileCheck.findMany({
    where: {
      userId
    },
    select: {
      targetId: true
    }
  });

  return profiles.map((p) => p.targetId);
};

export const findMatch = async ({ userId }) => {
  const filter = await filterModel.findUnique({
    where: {
      userId
    }
  });

  if (!filter) {
    return null;
  }

  const ids = await checkedIds(userId);
  const profile = await user.findFirst({
    where: {
      skill: filter.skill,
      timezone: filter.timezone,
      NOT: {
        id: { in: ids }
      }
    }
  });

  return profile;
};
