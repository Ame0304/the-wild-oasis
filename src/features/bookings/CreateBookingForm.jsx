import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Textarea from "../../ui/Textarea";
import RefSelect from "../../ui/RefSelect";
import RefCheckbox from "../../ui/RefCheckbox";
import AsyncSelect from "react-select/async";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { formatDate, subtractDates } from "../../utils/helpers";
import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";
import { getGuests } from "../../services/apiGuests";

const selectCustomStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused
      ? "var(--color-indigo-700)"
      : "var(--color-grey-300)",
    "&:hover": {
      borderColor: "var(--color-indigo-700)",
    },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "var(--color-indigo-700)"
      : isFocused
      ? "var(--color-brand-100)"
      : "var(--color-grey-0)",

    color: isSelected ? "var(--color-grey-0)" : "inherit",
  }),
};

function CreateBookingForm({ onCloseModal }) {
  const [selectedCabinId, setSelectedCabinId] = useState("");
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { register, formState, getValues, handleSubmit, control } = useForm();
  const { errors } = formState;

  const { isCreating, createBooking } = useCreateBooking();

  const loadOptions = async (searchTerm) => {
    const guests = await getGuests(searchTerm);
    return guests;
  };

  const cabinOptions = [
    { value: 24, label: "001" },
    { value: 25, label: "002" },
  ];

  function onSubmit(data) {
    console.log(data);
    // format and add extra necessary data to the booking
    const numNights = subtractDates(data.endDate, data.startDate);
    const cabinPrice = 250 * numNights;
    const extrasPrice = 15 * Number(data.numGuests) * numNights;
    const bookingData = {
      ...data,
      guestId: parseInt(data.guestId.value), // async select returns a guest object
      cabinId: parseInt(data.cabinId),
      numGuests: parseInt(data.numGuests),
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      numNights,
      status: "unconfirmed",
      cabinPrice: cabinPrice,
      extrasPrice: extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
    };
    console.log(bookingData);
    // createBooking(bookingData);
  }

  function onError(errors) {
    console.error(errors);
  }

  return (
    <Form
      type={onCloseModal ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Heading as="h1">Create a booking</Heading>
      {/* Guest Section*/}

      <FormRow label="Guest" error={errors?.guestId?.message}>
        <Controller
          name="guestId"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              styles={selectCustomStyles}
              loadOptions={loadOptions}
              defaultOptions
              onChange={(selectedOption) => {
                field.onChange(selectedOption);
              }}
              placeholder="Search for a guest"
            />
          )}
        />
      </FormRow>

      {/* Booking Details */}
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isCreating}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isCreating}
          {...register("endDate", {
            required: "This field is required",
            validate: (value) => {
              const start = getValues("startDate");
              return (
                new Date(value) > new Date(start) ||
                "End date must be after start date"
              );
            },
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isCreating}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Guest number should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <RefSelect
          id="cabin"
          options={cabinOptions}
          disabled={isCreating}
          {...register("cabinId", { required: "This field is required" })}
          onChange={(e) => setSelectedCabinId(e.target.value)}
        />
      </FormRow>

      <FormRow label="Has breakfast" error={errors?.hasBreakfast?.message}>
        <RefCheckbox
          id="hasBreakfast"
          {...register("hasBreakfast")}
          disabled={isCreating}
        >
          $ {settings?.breakfastPrice} per guest per night
        </RefCheckbox>
      </FormRow>

      <FormRow label="Booking Paid" error={errors?.isPaid?.message}>
        <RefCheckbox id="isPaid" {...register("isPaid")} disabled={isCreating}>
          Guest already paid
        </RefCheckbox>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations")}
          disabled={isCreating}
        />
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
