import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd, MdEdit } from "react-icons/md";
import { useWritingPanelCtx } from "../../../app/contexts/writingPanel/WritingPanelHook";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import { WritingPanelFormProps } from "../../../base/data/contexts/WritingPanelTypes";
// import { RegisterFormFields } from "../auth/AuthRegisterForm";
import InputText from "../input/InputText";
import InputTextArea from "../input/InputTextArea";

function WritingPanelForm({
  previewing,
  submit,
}: {
  previewing: boolean;
  submit: (data: WritingPanelFormProps) => void;
}) {
  const {
    state: { formData },
    action,
  } = useWritingPanelCtx();

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
    reset,
    setValue,
    clearErrors,
  } = useForm<WritingPanelFormProps>({
    mode: "onChange",
  });
  const thumbnail = watch("thumbnail")?.[0];

  const onSubmit = () => {
    //   check if form is valid
    trigger();
    if (!isValid) return;
    // proceed if so
    action.setFormData(getValues(), false);
    // console.log(getValues());
    submit(getValues());
  };

  // set the values of form formData (state) set with article draft
  useEffect(() => {
    // console.log("current form",getValues("thumbnail"));
    console.log(formData);
    if (formData)
      return reset({
        ...formData,
        content: formData.content,
      });
    // or if no more formData
    // and detected if form was filled,
    // reset the whole form
    console.log(getValues("title"));
    if (getValues("title")) return reset();
  }, [formData]);

  // set contexts formData before previewing
  useEffect(() => {
    // set state if previewing
    if (previewing) action.setFormData(getValues(), false);

    return () => {};
  }, [previewing]);

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-8">
      <form
        className="flex w-full flex-col gap-4 sm:gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          scaleTo="md"
          placeholder="Title..."
          // onChange={(ev) => editTitle(ev.target.value)}
          label="Title"
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
            key={errors.thumbnail?.message || "thumbnail-container"}
              id="thumbnail-upload-trigger"
              className={`flex w-full sm:w-[30rem] h-auto aspect-video
              rounded-lg border-2  group overflow-hidden
              flex-col relative
              ${
                errors.thumbnail
                  ? "border-dashed border-error"
                  : thumbnail || formData?.defaultThumbnailPreview
                  ? "border-solid border-content"
                  : "border-dashed border-base-content/20"
              }
              ${errors.thumbnail ? 'animate-headShake duration-500' : ''}
              `}
            >
              {/* thumbnail */}
              <div
                  key={thumbnail?.name || "placeholder-img"}
                className={`h-full w-full cursor-pointer  animate-zoomIn animate-duration-500`}
              >
                <img
                  className={`w-full h-full object-cover transition-transform duration-500 
                  group-hover:scale-125`}
                  src={
                    thumbnail
                      ? URL.createObjectURL(thumbnail)
                      : formData?.defaultThumbnailPreview ||
                        "https://picsum.photos/seed/picsum/300/600"
                  }
                  alt="thumbnail"
                />
              </div>
              {/* Overlays and icon */}
              <div
                className={`group pointer-events-none absolute inset-0 z-0 flex flex-col items-center 
                justify-center  transition-[opacity,background-color] duration-500 gap-2 sm:gap-4
                group-hover:opacity-100
                ${
                  errors.thumbnail
                    ? "bg-error/60 group-hover:bg-error/90"
                    : "bg-black/0 group-hover:bg-black/60"
                }
                `}
              >
                <div
                  className="flex items-center justify-center rounded-full bg-black/60 p-2 transition-transform
                duration-700 group-hover:scale-125"
                >
                  {thumbnail || formData?.defaultThumbnailPreview ? (
                    <MdEdit className="text-3xl text-white sm:text-4xl" />
                  ) : (
                    <MdAdd className="text-3xl text-white sm:text-4xl" />
                  )}
                </div>
                {errors.thumbnail && (
                  <div className="p-1 sm:p-2 rounded-lg bg-error/90 text-white ring-2 ring-base-content text-sm sm:text-base">
                    {errors.thumbnail?.message}
                  </div>
                )}
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
                        console.log("Invalid image file type");
                        return setError("thumbnail", {
                          type: "forbiddenFileType",
                          message: "Invalid image file type",
                        });
                      }

                      if (file.size > 2e6) {
                        // resetField("thumbnail");
                        console.log("File cannot be more than 2MB");
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
            <div className="flex justify-center gap-4 sm:gap-8">
              {thumbnail && !errors.thumbnail && (
                <button
                  className="--btn-resp btn-link btn text-base-content"
                  onClick={() => {
                    // using normal reset instead of resetField
                    // because after switching back from preview
                    // reset doesn't work for some reason.
                    reset({ thumbnail: undefined }, { keepValues: false });

                    // resetField("thumbnail",{defaultValue:undefined});
                  }}
                  type="button"
                  tabIndex={-1}
                >
                  Cancel
                </button>
              )}
              {thumbnail && errors.thumbnail && (
                <button
                  className="--btn-resp btn-link btn text-base-content"
                  onClick={() => {
                    return clearErrors("thumbnail");
                  }}
                  type="button"
                  tabIndex={-1}
                >
                  Undo
                </button>
              )}
              {!thumbnail && errors.thumbnail && (
                <button
                  className="--btn-resp btn-link btn text-base-content"
                  onClick={() => {
                    document
                      .getElementById("thumbnail-upload-trigger")
                      ?.click();
                  }}
                  type="button"
                  tabIndex={-1}
                >
                  Upload again
                </button>
              )}
            </div>
          </div>
        </div>

        <InputTextArea
          placeholder="This article talks about something interesting..."
          className="!h-32 max-h-32"
          label="Description"
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
          <InputText
            scaleTo="md"
            // value={title || ""}
            placeholder="Food and Beverages"
            // onChange={(ev) => editTitle(ev.target.value)}
            label="Topic (separate with commas)"
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
          <InputText
            scaleTo="md"
            // value={title || ""}
            placeholder="Japanese Food, Dessert"
            // onChange={(ev) => editTitle(ev.target.value)}
            label="Tags (separate with commas)"
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

        <InputTextArea
          className="min-h-[36rem] resize-none"
          placeholder="Write the article's content"
          label="Content"
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
          className="--btn-resp btn-primary btn"
          onClick={() => {
            scrollToTop(true);
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

export default React.memo(WritingPanelForm);
