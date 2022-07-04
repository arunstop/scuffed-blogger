import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MdAdd,
  MdAlternateEmail,
  MdEdit,
  MdNotes,
  MdPerson,
} from "react-icons/md";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";

interface SetupProfileFormFields {
  username: string;
  avatar: string;
  bio: string;
  desc: string;
}

function ProfileSetupForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SetupProfileFormFields>({ mode: "onChange" });

  const [avatar, setAvatar] = useState<File>();

  const onSubmit: SubmitHandler<SetupProfileFormFields> = async (data) => {
    console.log(data);
  };
  return (
    <>
      <form
        className="form-control  gap-4 sm:gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center">
          <label
            className="pointer-events-none flex flex-col items-center 
            [&>*]:pointer-events-auto"
          >
            <span
              className={`group relative h-36 w-36 transform cursor-pointer overflow-hidden rounded-[50%]
              border-2   transition-[border-radius] duration-500
              hover:rounded-xl  sm:h-48 
              sm:w-48 sm:border-4 md:h-60 md:w-60 lg:h-72 lg:w-72
              ${avatar ? "border-solid border-base-content": "border-dashed border-base-content/20 hover:border-base-content/100"}
              `}

            >
              <img
                className="h-full w-full max-w-none object-cover transition-all"
                src={
                  avatar
                    ? URL.createObjectURL(avatar)
                    : "https://picsum.photos/seed/picsum/300/300"
                }
              />
              <div
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 
                opacity-0 transition-[opacity,background-color] duration-500 
                group-hover:bg-black/60 group-hover:opacity-100"
              >
                {avatar ? (
                  <MdEdit className="text-4xl text-white sm:text-5xl" />
                ) : (
                  <MdAdd className="text-4xl text-white sm:text-5xl" />
                )}
              </div>
            </span>
            <span
              className="--btn-resp btn btn-link p-0 !text-base font-bold text-primary-content sm:!text-lg"
              tabIndex={-1}
            >
              {avatar ? "Change the profile picture":"Add a profile picture"}
            </span>
            <input
              type={"file"}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                if (!e.target.files?.[0]) return;
                const file = e.target.files[0];
                const validImgTypes = ["image/png", "image/gif", "image/jpeg"];
                // check the files is an image
                if (!validImgTypes.includes(file.type))
                  return alert("Invalid image file type");
                // only accept file lower than 2MB
                if (file.size > 2e6)
                  return alert("File cannot be more than 2MB");
                setAvatar(file);
              }}
            />
          </label>
          {avatar && <span
            className="--btn-resp btn btn-link p-0 !text-base font-bold text-error sm:!text-lg"
            onClick={() => {
              setAvatar(undefined);
            }}
            tabIndex={-1}
          >
            Cancel
          </span>}
        </div>
        <MainTextInput
          type="text"
          placeholder="Username"
          icon={<MdAlternateEmail />}
          {...register("username", {
            required: { value: true, message: "Username cannot be empty" },
            minLength: {
              value: 4,
              message: "Username requires must be between 4 - 24 characters",
            },
            maxLength: {
              value: 24,
              message: "Username requires must be between 4 - 24 characters",
            },
            pattern: {
              // value: /^(?:[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+\s?)+$/gmis,
              value: /^[a-zA-Z0-9_]+$/i,
              message:
                "Username requires only letters, numbers and underscores",
            },
          })}
          error={!!errors.username}
          errorMsg={errors.username?.message}
        />

        <MainTextInput
          type="text"
          placeholder="Short bio"
          icon={<MdPerson />}
          {...register("bio", {
            required: { value: true, message: "Bio cannot be empty" },
            minLength: {
              value: 10,
              message: "Username requires must be between 10 - 100 characters",
            },
            maxLength: {
              value: 100,
              message: "Username requires must be between 10 - 100 characters",
            },
          })}
          error={!!errors.bio}
          errorMsg={errors.bio?.message}
        />
        <MainTextInput
          type="text"
          placeholder="About me"
          icon={<MdNotes />}
          {...register("desc", {
            // required: { value: true, message: "Password cannot be empty" },
            maxLength: {
              value: 750,
              message: "Password should be 8 characters minimum",
            },
          })}
          error={!!errors.desc}
          errorMsg={errors.desc?.message}
        />

        <MainTextAreaInput className="min-h-[24rem] indent-8" />

        <button className="--btn-resp btn btn-primary text-lg font-bold sm:text-xl">
          Register
        </button>
        <span
          className="--btn-resp btn btn-link p-0 !text-base font-bold text-primary-content sm:!text-lg"
          onClick={() => {}}
          tabIndex={-1}
        >
          Maybe later
        </span>
      </form>
    </>
  );
}

export default ProfileSetupForm;
