import mongoose from "mongoose";

/**
 * Builds MongoDB query for card filtering based on filter criteria
 * @param {Object} filterBy - Filter criteria
 * @returns {Object} MongoDB query object
 */
export function buildCardFilterQuery(filterBy = {}) {
  const { title, labels, members, noMembers, includeNoLabels } = filterBy;
  const query = {};

  if (title && title.trim()) {
    query.title = {
      $regex: title.trim(),
      $options: "i",
    };
  }

  if (labels && labels.length > 0) {
    if (includeNoLabels) {
      query.$or = [{ labelIds: { $in: labels } }, { labelIds: { $size: 0 } }];
    } else {
      query.labelIds = { $in: labels };
    }
  } else if (includeNoLabels) {
    query.labelIds = { $size: 0 };
  }

  if (members && members.length > 0) {
    const memberIds = members.map(memberId => {
      if (typeof memberId === "string") {
        try {
          return new mongoose.Types.ObjectId(memberId);
        } catch (e) {
          console.warn("Invalid ObjectId format:", memberId);
          return memberId;
        }
      }
      return memberId;
    });

    if (noMembers) {
      const memberQuery = {
        $or: [
          { "assignees.userId": { $in: memberIds } },
          { assignees: { $size: 0 } },
        ],
      };

      if (query.$or) {
        // If we already have $or from label filtering, combine them
        query.$and = [{ $or: query.$or }, memberQuery];
        delete query.$or;
      } else {
        Object.assign(query, memberQuery);
      }
    } else {
      query["assignees.userId"] = { $in: memberIds };
    }
  } else if (noMembers) {
    query.assignees = { $size: 0 };
  }

  console.log("🚀 ~ buildCardFilterQuery ~ query:", query);
  return query;
}

/**
 * Validates filter parameters
 * @param {Object} filterBy - Filter criteria to validate
 * @returns {Object} Validated and sanitized filter criteria
 */
export function validateFilterParams(filterBy = {}) {
  const validated = {};

  if (filterBy.title && typeof filterBy.title === "string") {
    validated.title = filterBy.title.trim();
  }

  if (filterBy.members) {
    if (Array.isArray(filterBy.members)) {
      validated.members = filterBy.members.filter(
        member => member && typeof member === "string"
      );
    } else if (typeof filterBy.members === "string") {
      validated.members = filterBy.members
        .split(",")
        .map(member => member.trim())
        .filter(member => member);
    }
  }

  validated.noMembers = Boolean(filterBy.noMembers);
  validated.includeNoLabels = Boolean(filterBy.includeNoLabels);

  return validated;
}
