import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";
import Heading from "../../ui/Heading";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import RefSelect from "../../ui/RefSelect";
import RefCheckbox from "../../ui/RefCheckbox";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { formatDate, subtractDates } from "../../utils/helpers";
import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";

function CreateBookingForm({ onCloseModal }) {
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [selectedCabinId, setSelectedCabinId] = useState("");
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { isCreating, createBooking } = useCreateBooking();

  const guestOptions = [
    { value: 33, label: "Jonas Schmedtmann" },
    { value: 34, label: "Jonathan Smith" },
  ];

  const cabinOptions = [
    { value: 24, label: "001" },
    { value: 25, label: "002" },
  ];
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    // format and add extra necessary data to the booking
    const numNights = subtractDates(data.endDate, data.startDate);
    const cabinPrice = 250 * numNights;
    const extrasPrice = 15 * Number(data.numGuests) * numNights;
    const bookingData = {
      ...data,
      guestId: parseInt(data.guestId),
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
        <RefSelect
          id="guest"
          options={guestOptions}
          {...register("guestId", { required: "This field is required" })}
          onChange={(e) => setSelectedGuestId(e.target.value)}
        />
      </FormRow>

      {/* Booking Details */}
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
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
          {...register("cabinId", { required: "This field is required" })}
          onChange={(e) => setSelectedCabinId(e.target.value)}
        />
      </FormRow>

      <FormRow label="Has breakfast" error={errors?.hasBreakfast?.message}>
        <RefCheckbox id="hasBreakfast" {...register("hasBreakfast")}>
          $ {settings?.breakfastPrice} per guest per night
        </RefCheckbox>
      </FormRow>

      <FormRow label="Booking Paid" error={errors?.isPaid?.message}>
        <RefCheckbox id="isPaid" {...register("isPaid")}>
          Guest already paid
        </RefCheckbox>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations")}
        />
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
