import { useEffect, useState } from "react";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Textarea from "../../ui/Textarea";
import RefCheckbox from "../../ui/RefCheckbox";
import AsyncSelect from "react-select/async";
import Select from "react-select";

import { useForm, Controller } from "react-hook-form";
import { formatDate, subtractDates } from "../../utils/helpers";
import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";
import { getGuests } from "../../services/apiGuests";
import { getAvailableCabins } from "../../services/apiCabins";

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
  const [cabinOptions, setCabinOptions] = useState([]);
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { isCreating, createBooking } = useCreateBooking();
  const { register, formState, getValues, handleSubmit, control, watch } =
    useForm();
  const { errors } = formState;
  const isWorking = isCreating || isLoadingSettings;

  const guestOptions = async (searchTerm) => {
    const guests = await getGuests(searchTerm);
    return guests;
  };

  const loadCabinOptions = async () => {
    const { startDate, endDate, numGuests } = getValues();
    // Only fetch if all required fields are filled
    if (!startDate || !endDate || !numGuests) return;
    const cabins = await getAvailableCabins(startDate, endDate, numGuests);
    const availableCabins = cabins.map((cabin) => ({
      value: {
        id: cabin.id,
        regularPrice: cabin.regularPrice,
        discount: cabin.discount,
      },
      label: `${cabin.name} - ${cabin.maxCapacity} guests - $${
        cabin.regularPrice - cabin.discount
      }`,
    }));
    setCabinOptions(availableCabins);
  };

  useEffect(() => {
    loadCabinOptions();
  }, [watch("startDate"), watch("endDate"), watch("numGuests")]);

  function onSubmit(data) {
    // format and add extra necessary data to the booking
    const numNights = subtractDates(data.endDate, data.startDate);
    const cabinPrice = data.cabinId.value.regularPrice * numNights;
    const extrasPrice = data.hasBreakfast
      ? settings?.breakfastPrice * Number(data.numGuests) * numNights
      : 0;
    const bookingData = {
      ...data,
      guestId: Number(data.guestId.value), // async select returns a guest object
      cabinId: Number(data.cabinId.value.id),
      numGuests: Number(data.numGuests),
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      numNights,
      status: "unconfirmed",
      cabinPrice: cabinPrice,
      extrasPrice: extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
    };
    createBooking(bookingData);
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
              loadOptions={guestOptions}
              defaultOptions
              onChange={(selectedOption) => {
                field.onChange(selectedOption);
              }}
              placeholder="Search for a guest"
              disabled={isWorking}
            />
          )}
        />
      </FormRow>

      {/* Booking Details */}
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isWorking}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isWorking}
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
          disabled={isWorking}
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
        <Controller
          name="cabinId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              styles={selectCustomStyles}
              options={cabinOptions}
              placeholder="Select a cabin"
              onChange={(option) => {
                field.onChange(option);
              }}
              value={field.value}
            />
          )}
        />
      </FormRow>

      <FormRow label="Has breakfast" error={errors?.hasBreakfast?.message}>
        <RefCheckbox
          id="hasBreakfast"
          {...register("hasBreakfast")}
          disabled={isWorking}
        >
          $ {settings?.breakfastPrice} per guest per night
        </RefCheckbox>
      </FormRow>

      <FormRow label="Booking Paid" error={errors?.isPaid?.message}>
        <RefCheckbox id="isPaid" {...register("isPaid")} disabled={isWorking}>
          Guest already paid
        </RefCheckbox>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations")}
          disabled={isWorking}
        />
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
