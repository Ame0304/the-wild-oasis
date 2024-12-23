import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import Select from "react-select";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { getCountryOptions } from "../../utils/helpers";
import { useCreateGuest } from "./useCreateGuest";

function CreateGuestForm() {
  const { register, handleSubmit, formState, control } = useForm();
  const { errors } = formState;
  const { createGuest, isCreating } = useCreateGuest();

  const countries = getCountryOptions();
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: (
      <div>
        <img
          src={country.flagUrl}
          alt={`Flag of ${country.name}`}
          style={{ height: "1.5em", marginRight: "0.5em" }}
        />
        {country.name}
      </div>
    ),
    flagUrl: country.flagUrl,
  }));

  function onSubmit(data) {
    const formattedData = {
      ...data,
      nationalID: Number(data.nationalID),
      nationality: data.nationality.value,
      countryFlag: data.nationality.flagUrl,
    };
    createGuest(formattedData);
  }

  function onError(errors) {
    console.error(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          placeholder="Full name"
          disabled={isCreating}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          placeholder="Email"
          disabled={isCreating}
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
      </FormRow>
      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={countryOptions}
              placeholder="Select a country"
              disabled={isCreating}
              onChange={(option) => {
                field.onChange(option);
              }}
              value={field.value}
            />
          )}
        />
      </FormRow>
      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          id="nationalID"
          type="number"
          placeholder="National ID"
          disabled={isCreating}
          {...register("nationalID", { required: true })}
        />
      </FormRow>
      <FormRow>
        <Button variation="secondary" type="reset" disabled={isCreating}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
