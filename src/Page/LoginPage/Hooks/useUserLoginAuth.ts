import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
// import { AuthType } from "../Type/Posts";
import { authenticateUser, userSignUp } from "../API/UserApi";
import { TUserContext } from "../../../Component/Context/AuthProvider";
import { TSignUpPayload } from "../Type/Posts";

export default function useUserLoginAuth(
  setUser: (user: TUserContext) => void
) {
  const [expanded, setExpanded] = useState(false);

  const { mutateAsync: authenticateUserId } = useMutation({
    mutationFn: async (payload: { id: string }): Promise<boolean | null> => {
      const data = await authenticateUser(payload);
      if (data?.authentication) {
        const { name: user_name, id: user_id } = data.user!;
        setUser({ user_id, user_name });
      } else {
        setExpanded(true);
      }
      return data!.authentication;
    },
  });

  const { mutateAsync: signUp } = useMutation({
    mutationFn: async (payload: TSignUpPayload): Promise<boolean | null> => {
      const insertion = await userSignUp(payload);
      if (!insertion) return false;
      return await authenticateUserId({ id: payload.id });
    },
  });

  return {
    expanded,
    setExpanded,
    authenticateUser: authenticateUserId,
    signUp,
  };
}
