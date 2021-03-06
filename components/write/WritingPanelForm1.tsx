import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit, MdAdd } from "react-icons/md";
import { useWritingPanelCtx } from "../../utils/contexts/writingPanel/WritingPanelHook";
import { WritingPanelFormProps } from "../../utils/data/contexts/WritingPanelTypes";
// import { RegisterFormFields } from "../auth/AuthRegisterForm";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";

function WritingPanelForm1({
  previewing,
  submit,
}: {
  previewing: boolean;
  submit: () => void;
}) {
  const {
    register,
    watch,
    handleSubmit,
    getValues,
    trigger,
    setError,
    control,
    formState: { isValid, errors },
    resetField,
  } = useForm<WritingPanelFormProps>({
    mode: "onChange",
  });

  const thumbnail = watch("thumbnail")?.[0];

  const {
    state: { formData },
    action,
  } = useWritingPanelCtx();

  const onSubmit = () => {
    //   check if form is valid
    trigger();
    if (!isValid) return alert("form is invalid");
    // proceed if so
    action.setFormData(getValues());
    submit();
  };

  useEffect(() => {
    const formData = getValues();
    if (previewing) action.setFormData(formData);

    return () => {};
  }, [previewing]);

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-8">
      <form
        className="flex w-full flex-col gap-4 sm:gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <MainTextInput
          scaleTo="md"
          placeholder="Title..."
          // onChange={(ev) => editTitle(ev.target.value)}
          label="Title"
          defaultValue={formData?.title || ""}
          {...register("title", {
            required: { value: true, message: "Title can not be empty" },
            minLength: {
              value: 8,
              message: "Title requires minimum 8 characters",
            },
          })}
          error={!!errors.title}
          errorMsg={errors.title?.message || ""}
        />
        <div className="flex flex-col gap-1 sm:gap-2">
          <span className={`text-base sm:text-lg font-semibold`}>
            Thumbnail
          </span>
          <div className="flex w-full flex-col sm:w-max">
            <label
              className={`flex w-full sm:w-[30rem] h-auto aspect-video
              rounded-lg border-2  group overflow-hidden
              flex-col relative
              ${
                !thumbnail
                  ? "border-dashed border-base-content/20"
                  : "border-solid border-base-content"
              }
              `}
            >
              <img
                className={`h-full w-full cursor-pointer object-cover transition-transform duration-500 
                group-hover:scale-125`}
                src={
                  thumbnail
                    ? URL.createObjectURL(thumbnail)
                    : "https://picsum.photos/seed/picsum/300/600"
                }
                alt="thumbnail"
              />

              <div
                className="group pointer-events-none absolute inset-0 z-10 flex items-center justify-center 
                bg-black/0 transition-[opacity,background-color] duration-500 group-hover:bg-black/60
                group-hover:opacity-100
                "
              >
                <div
                  className="flex items-center justify-center rounded-full bg-black/60 p-2 transition-transform
                duration-700 group-hover:scale-125"
                >
                  {thumbnail ? (
                    <MdEdit className="text-3xl text-white sm:text-4xl" />
                  ) : (
                    <MdAdd className="text-3xl text-white sm:text-4xl" />
                  )}
                </div>
              </div>

              <Controller
                render={({
                  formState,
                  field: { ref, name, onChange, onBlur },
                }) => (
                  <input
                    id="input-thumbnail"
                    type={"file"}
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                    // onChange={(event) => {
                    //   props.
                    // }}
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(ev) => {
                      const files = ev.target.files;
                      if (!files?.length) return;
                      const file = files[0];
                      const validImgTypes = [
                        "image/png",
                        "image/gif",
                        "image/jpeg",
                      ];
                      if (!validImgTypes.includes(file.type)) {
                        // resetField("avatar");
                        return setError("thumbnail", {
                          type: "forbiddenFileType",
                          message: "Invalid image file type",
                        });
                      }

                      if (file.size > 2e6) {
                        // resetField("thumbnail");
                        return setError("thumbnail", {
                          type: "exceededFileSize",
                          message: "File cannot be more than 2MB",
                        });
                      }

                      onChange(ev.target.files);
                    }}
                  />
                )}
                control={control}
                name="thumbnail"
              />
            </label>
            {thumbnail && (
              <div className="flex justify-center gap-4 sm:gap-8">
                <button
                  className="--btn-resp btn btn-link text-base-content"
                  onClick={() => {
                    resetField("thumbnail", {
                      keepError: false,
                      keepTouched: false,
                    });
                  }}
                  type="button"
                  tabIndex={-1}
                >
                  Cancel
                </button>
                {/* <button
              className="--btn-resp btn btn-link text-primary gap-1 sm:gap-2"
              onClick={() => {
                onSubmit();
              }}
              type="button"
            >
              <span className="text-xl sm:text-2xl">
                {!thumbnail ? <MdAdd /> : <MdEdit />}
              </span>
              {!thumbnail ? "Add a thumbnail" : "Change thumbnail"}
            </button> */}
              </div>
            )}
          </div>
        </div>

        <MainTextAreaInput
          placeholder="This article talks about something interesting..."
          className="!h-32 max-h-32"
          label="Description"
          defaultValue={formData?.desc || ""}
          {...register("desc", {
            required: { value: true, message: "Desc can not be empty" },
            minLength: {
              value: 8,
              message: "Desc requires minimum 8 characters",
            },
          })}
          error={!!errors.desc}
          errorMsg={errors.desc?.message || ""}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <MainTextInput
            scaleTo="md"
            // value={title || ""}
            placeholder="Topic..."
            // onChange={(ev) => editTitle(ev.target.value)}
            label="Topic"
            defaultValue={formData?.topics || ""}
            {...register("topics", {
              required: { value: true, message: "Topics can not be empty" },
              minLength: {
                value: 8,
                message: "Topics requires minimum 8 characters",
              },
            })}
            error={!!errors.topics}
            errorMsg={errors.topics?.message || ""}
          />
          <MainTextInput
            scaleTo="md"
            // value={title || ""}
            placeholder="Tags..."
            // onChange={(ev) => editTitle(ev.target.value)}
            label="Tags"
            defaultValue={formData?.tags || ""}
            {...register("tags", {
              required: { value: true, message: "Tags can not be empty" },
              minLength: {
                value: 8,
                message: "Tags requires minimum 8 characters",
              },
            })}
            error={!!errors.tags}
            errorMsg={errors.tags?.message || ""}
          />
        </div>

        <MainTextAreaInput
          className="min-h-[36rem] resize-none"
          placeholder="Write the article's content"
          label="Content"
          defaultValue={decodeURIComponent(formData?.content || "")}
          {...register("content", {
            required: { value: true, message: "Content can not be empty" },
            minLength: {
              value: 8,
              message: "Content requires minimum 8 characters",
            },
          })}
          error={!!errors.content}
          errorMsg={errors.content?.message || ""}
        />
      </form>

      <div className="flex w-full flex-row flex-wrap justify-end gap-2 sm:gap-4">
        <button
          className="--btn-resp btn-outline btn"
          onClick={() => {
            // setContent("");
          }}
          type="button"
        >
          Reset
        </button>
        <button
          className="--btn-resp btn btn-primary"
          onClick={() => {
            onSubmit();
          }}
          type="button"
        >
          Submit Article
        </button>
      </div>
    </div>
  );
}

export default React.memo(WritingPanelForm1);
