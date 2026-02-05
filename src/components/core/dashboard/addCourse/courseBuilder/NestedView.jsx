/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { SubSectionModal } from "./SubSectionModal";
import { ConfirmationModal } from "../../../../common/ConfirmationModal";
import { setCourse } from "../../../../../slices/courseSlice";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";

export const NestedView = ({ handleChangeEditSectionName }) => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [addSubSection, setAddSubSection] = useState(false);
  const [viewSubSection, setViewSubSection] = useState(false);
  const [editSubSection, setEditSubSection] = useState(false);
  const [confimationModal, setConfimationModal] = useState(false);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfimationModal(false);
  };

  const handleDeleteSubsection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({
      subSectionId,
      sectionId,
      token,
    });
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        // Corrected: returning updated section
        section._id === sectionId ? result : section
      );
      const updatedCourse = {
        ...course,
        courseContent: updatedCourseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    setConfimationModal(false);
  };

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course.courseContent.map((section) => (
          <details key={section._id} open>
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <span className="font-semibold text-richblack-50">
                  {section?.sectionName}
                </span>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  onClick={() =>
                    setConfimationModal({
                      text1: "Delete this section?",
                      text2: "All lectures in this section will be deleted.",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => {
                        handleDeleteSection(section._id);
                      },
                      btn2Handler: () => {
                        setConfimationModal(false);
                      },
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <BiSolidDownArrow className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {section.subSection && section.subSection.length > 0 ? (
                section.subSection.map((data) => (
                  <div
                    key={data?._id}
                    onClick={() => setViewSubSection(data)}
                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                  >
                    <div className="flex items-center gap-x-3 py-2 ">
                      <RxDropdownMenu className="text-2xl text-richblack-50" />
                      <span className="font-semibold text-richblack-50">
                        {data?.title}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setEditSubSection({
                            ...data,
                            sectionId: section._id,
                          })
                        }
                      >
                        <MdEdit className="text-xl text-richblack-300" />
                      </button>
                      <button
                        onClick={() =>
                          setConfimationModal({
                            text1: "Delete this Sub-Section?",
                            text2: "Current lectures will be deleted.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => {
                              handleDeleteSubsection(data._id, section._id);
                            },
                            btn2Handler: () => {
                              setConfimationModal(false);
                            },
                          })
                        }
                      >
                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-3 flex items-center gap-x-1 text-richblack-50">
                  No sub-sections added yet
                </p>
              )}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <AiOutlinePlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : null}

      {confimationModal ? (
        <ConfirmationModal modalData={confimationModal} />
      ) : null}
    </>
  );
};
