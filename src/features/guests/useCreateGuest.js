import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createGuest as createGuestApi } from "../../services/apiGuests";

export function useCreateGuest() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createGuestApi,
    onSuccess: () => {
      toast.success(`New guest successfully created`);
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      navigate(`/`);
    },
    onError: (err) => toast.error(err.message),
  });

  return { createGuest, isCreating };
}
