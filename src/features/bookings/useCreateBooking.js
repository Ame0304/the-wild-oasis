import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createBooking as creatingBookingApi } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: creatingBookingApi,
    onSuccess: (data) => {
      toast.success(`New booking ${data[0].id}successfully created`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate(`/bookings/${data[0].id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  return { createBooking, isCreating };
}
