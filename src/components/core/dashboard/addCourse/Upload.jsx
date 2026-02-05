/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileUpload } from "react-icons/fa";
import ReactPlayer from "react-player";

export const Upload = ({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
    };
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  });

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSrc ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSrc}
                alt="preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%",
                }}
              >
                {/* todo: replace clodinary with AWS S3, EC2 */}
                <ReactPlayer
                  url={previewSrc}
                  controls={true}
                  playing={true}
                  playsinline={true}
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              </div>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSrc("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input ref={inputRef} {...getInputProps()} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FaFileUpload className="text-2xl text-yellow-50" />
            </div>

            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024 x 576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};
