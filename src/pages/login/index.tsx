import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutationRequest } from "@/hooks/useMutation";
import { loginSchema } from "@/schema/login.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const notification = useNotificationStore();
  const { mutate } = useMutationRequest({
    key: ["login"],
    url: "auth/login", method: "post", options: {
      onSuccess: (data) => {
        localStorage.setItem("jwt", JSON.stringify(data));
        navigate({
          to: "/user",
          replace: true
        });
        notification.updateState({ message: "Đăng nhập thành công", type: "success", open: true });
      },
      onError: (error) => {
        notification.updateState({ message: error.message, type: "error", open: true });
      }
    }
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await mutate(value);
    },
  });

  return <section className="flex flex-col md:flex-row h-screen items-center">
    <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-full">
      <img src="../../src/assets/images/login-logo.jpg" alt="" className="w-full h-full object-cover" />
    </div>

    <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 px-6 lg:px-16 xl:px-12
        flex items-center justify-center">
      <div className="w-full h-100">
        <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Welcome to Library Web</h1>
        <form className="mt-6" onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }} method="POST">
          <FieldGroup className="gap-4">
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Account Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter Account"
                      autoComplete="off"
                      className="w-full px-4 py-5 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Account Pass</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter Account"
                      autoComplete="off"
                      type="password"
                      className="w-full px-4 py-5 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <div className="text-right mt-2">
            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
          </div>

          {/* <ButtonSubmit className="bg-blue-600 w-full py-[20px] mt-[10px]" /> */}
          <Button className="bg-blue-600 w-full py-[20px] mt-[10px]" type="submit">Login</Button>
        </form>
      </div>
    </div>
  </section>
}
