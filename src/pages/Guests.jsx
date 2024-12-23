import Heading from "../ui/Heading";
import CreateGuestForm from "../features/guests/CreateGuestForm";

function Guests() {
  return (
    <>
      <Heading as="h1">Create a new guest</Heading>
      <CreateGuestForm />
    </>
  );
}

export default Guests;
