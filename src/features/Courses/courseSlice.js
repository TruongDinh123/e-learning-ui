import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { courseService } from "./courseService";

export const createCourse = createAsyncThunk(
  "/e-learning/course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadImageCourse = createAsyncThunk(
  "/e-learning/upload-image-course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.uploadImageCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewCourses = createAsyncThunk(
  "/e-learning/get-courses",
  async (data, { getState, rejectWithValue }) => {
    const coursesFromStore = getState().course.courses;

    if (coursesFromStore.length > 0) {
      return coursesFromStore;
    }

    try {
      const response = await courseService.viewCourse(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const selectCourse = createAsyncThunk(
  "/e-learning/select-course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.selectCourse(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "/e-learning/course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.deleteCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editCourse = createAsyncThunk(
  "/e-learning/update-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.editCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getACourse = createAsyncThunk(
  "/e-learning/single/course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getACourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getACourseByInfo = createAsyncThunk(
  "/e-learning/single/get-info-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getACourseByInfo(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addStudentToCourse = createAsyncThunk(
  "/e-learning/invite-user-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.addStudentToCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addTeacherToCourse = createAsyncThunk(
  "/e-learning/invite-teacher-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.addTeacherToCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCourseTeacher = createAsyncThunk(
  "/e-learning/update-teacher-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourseTeacher(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeStudentFromCourse = createAsyncThunk(
  "/e-learning/delete-user-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.removeStudentFromCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStudentCourses = createAsyncThunk(
  "/e-learning/get-student-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getStudentCourses();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCourseSummary = createAsyncThunk(
  "/e-learning/users/courses/summary",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseSummary();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCourseById = createAsyncThunk(
    "/e-learning/get-info-course/:{$courseID}",
    async (courseID, { rejectWithValue }) => {
        try {
            const response = await courseService.getCourseById(courseID);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const getCourseCompletion = createAsyncThunk(
  "/e-learning/get-complete-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseCompletion(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCoursePublic = createAsyncThunk(
  "/e-learning/get-public-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getPublicCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const buttonPublicCourse = createAsyncThunk(
  "/e-learning/get-public-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.buttonPublicCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const buttonPriavteourse = createAsyncThunk(
  "/e-learning/get-priavte-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.buttonPriavteCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNotification = createAsyncThunk(
  "/e-learning/course/notifications",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.createNotification(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//sub-course
export const getAllSubCourses = createAsyncThunk(
  "/e-learning/get-all-subcourses/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getAllSubCourses(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllSubCoursesById = createAsyncThunk(
  "/e-learning/get-all-subcourses-by-id/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getAllSubCoursesById(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStudentScoresByCourse = createAsyncThunk(
  "/e-learning/get-all-score-by-id/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getStudentScoresByCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  course: "",
  subCourses: [],
  courses: [],
  Acourse: {},
  getACourse: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetStateCourse = createAction("Reset_all_course");

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    updateCourseImage: (state, action) => {
      const { courseId, imageUrl } = action.payload;
      const courseIndex = state.courses.metadata.findIndex(
        (course) => course._id === courseId
      );
      if (courseIndex !== -1) {
        state.courses.metadata[courseIndex].image_url = imageUrl;
      }
    },
    addStudentToCourseSuccess: (state, action) => {
      const { courseId, studentInfo } = action.payload;
      const courseIndex = state.courses.metadata.findIndex(
        (course) => course._id === courseId
      );
      if (courseIndex !== -1) {
        const student = {
          _id: studentInfo._id,
          firstName: studentInfo.firstName,
          lastName: studentInfo.lastName,
        };
        const existingStudentIndex = state.courses.metadata[
          courseIndex
        ].students.findIndex((student) => student._id === studentInfo._id);
        if (existingStudentIndex === -1) {
          // Nếu học viên chưa tồn tại, thêm vào mảng students
          if (!state.courses.metadata[courseIndex].students) {
            state.courses.metadata[courseIndex].students = [];
          }
          state.courses.metadata[courseIndex].students.push(student);
        }
      }
    },
    removeStudentFromCourseSuccess: (state, action) => {
      const { courseId, studentId } = action.payload;
      const courseIndex = state.courses.metadata.findIndex(
        (course) => course._id === courseId
      );
      if (courseIndex !== -1) {
        state.courses.metadata[courseIndex].students = state.courses.metadata[
          courseIndex
        ].students.filter((student) => student._id !== studentId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const newCourse = {
          _id: action.payload.metadata._id,
          name: action.payload.metadata.name,
          title: action.payload.metadata.title,
          category: action.payload.metadata.category,
          quizzes: action.payload.metadata.quizzes,
          lessons: action.payload.metadata.lessons,
          students: action.payload.metadata.students,
          showCourse: action.payload.metadata.showCourse,
          image_url: action.payload.metadata.image_url,
        };
        state.courses.metadata.push(newCourse) || state.courses.push(newCourse);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(viewCourses.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.courses = action.payload;
      })
      .addCase(viewCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(deleteCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.courses.metadata = state.courses.metadata.filter(
          (course) => course._id !== action.meta.arg
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(editCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const index = state.courses.metadata.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses.metadata[index] = action.payload;
        }
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(uploadImageCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(uploadImageCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const { courseId, imageUrl } = action.payload.metadata.findCourse;
        const courseIndex = state.courses.metadata.findIndex(
          (course) => course._id === courseId
        );
        if (courseIndex !== -1) {
          state.courses.metadata[courseIndex].image_url = imageUrl;
        }
      })
      .addCase(uploadImageCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getAllSubCourses.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllSubCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.subCourses = action.payload;
      })
      .addCase(getAllSubCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getACourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getACourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getACourse = action.payload;
      })
      .addCase(getACourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getACourseByInfo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getACourseByInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.Acourse = action.payload;
      })
      .addCase(getACourseByInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(selectCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(selectCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.courses = action.payload;
      })
      .addCase(selectCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(resetStateCourse, () => initialState);
  },
});

export const {
  updateCourseImage,
  addStudentToCourseSuccess,
  removeStudentFromCourseSuccess,
} = courseSlice.actions;

export default courseSlice.reducer;
