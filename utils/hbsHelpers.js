import { DateTime } from "luxon";

const hbsHelpers = {
  renderEditDeleteIcon(postOwner, loggedInUser, postId) {
    if (loggedInUser && postOwner._id.toString() === loggedInUser.id) {
      return `<div class="d-flex column-gap-3 mt-5">
          <a href="/posts/edit/${postId}" class="btn btn-primary"><i class="bi bi-pencil-square me-1"></i>Edit</a>
          <form action="/posts/delete/${postId}?_method=delete" method="post">
            <button type="submit" class="btn btn-danger">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </form>
        </div>`;
    }
    return "";
  },
  relativeDate(date) {
    return DateTime.fromJSDate(date).toRelative();
  },
  absoluteDate(date) {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED);
  },
  addOne(num) {
    return num + 1;
  },
};

export default hbsHelpers;
