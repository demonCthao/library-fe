import { JwtPayload } from "@/components/avatar-dropdown";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROLE } from "@/constants/role.constants";
import { useMutationRequest } from "@/hooks/useMutation";
import { loginSchema } from "@/schema/login.schema";
import { useAccountStore } from "@/store/account.store";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { BookOpen, Lock, User } from "lucide-react"; // Thêm icon cho đẹp

export default function LoginPage() {
  const navigate = useNavigate();
  const notification = useNotificationStore();

  const { mutate } = useMutationRequest({
    key: ["login"],
    url: "auth/login",
    method: "post",
    options: {
      onSuccess: (data: { user: JwtPayload, access_token: string }) => {
        const token = data.access_token;
        localStorage.setItem("jwt", JSON.stringify(data));
        const decoded = jwtDecode<JwtPayload>(token);
        useAccountStore.getState().setUser(decoded);

        if (decoded.role === ROLE.USER) {
          navigate({ to: "/user-page" });
        } else {
          navigate({ to: "/dashboard" });
        }

        notification.updateState({
          message: "Đăng nhập thành công",
          type: "success",
          open: true
        });
      },
      onError: (error) => {
        notification.updateState({ message: error.message, type: "error", open: true });
      }
    }
  });

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => { await mutate(value); },
  });

  return (
    <section className="flex h-screen items-center bg-[#121214]">
      {/* LEFT SIDE: Image with Overlay */}
      <div className="relative hidden lg:block w-1/2 xl:w-2/3 h-full">
        <img
          src="../../src/assets/images/login-logo.jpg"
          alt="Library"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12">
          <h2 className="text-4xl font-bold text-white mb-2">Hệ thống thư viện số</h2>
          <p className="text-emerald-500 text-lg">Khám phá kho tàng tri thức vô tận.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="bg-[#121214] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 px-8 lg:px-16 xl:px-20 flex items-center justify-center h-full">
        <div className="w-full">
          <div className="mb-10 flex flex-col items-center lg:items-start">
            <div className="bg-emerald-500/10 p-3 rounded-2xl mb-4">
              <BookOpen className="text-emerald-500 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Chào mừng trở lại</h1>
            <p className="text-gray-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
            method="POST"
            className="space-y-6"
          >
            <FieldGroup className="gap-5">
              {/* Field Username */}
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex flex-col gap-2">
                      <FieldLabel className="text-gray-300 font-medium ml-1">Tên tài khoản</FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                          {...field.state}
                          id={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Nhập tài khoản của bạn"
                          className="w-full pl-10 pr-4 py-6 rounded-xl bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all shadow-inner"
                        />
                      </div>
                      {isInvalid && <FieldError className="text-red-400 text-xs mt-1" errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              {/* Field Password */}
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex flex-col gap-2">
                      <FieldLabel className="text-gray-300 font-medium ml-1">Mật khẩu</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                          {...field.state}
                          type="password"
                          id={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-6 rounded-xl bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all shadow-inner"
                        />
                      </div>
                      {isInvalid && <FieldError className="text-red-400 text-xs mt-1" errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-emerald-500" />
                <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#" className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Quên mật khẩu?</a>
            </div>

            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white w-full py-7 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] mt-4"
              type="submit"
            >
              Đăng nhập ngay
            </Button>

            <p className="text-center text-gray-500 text-sm mt-8">
              Chưa có tài khoản? <a href="#" className="text-emerald-500 font-bold hover:underline">Đăng ký miễn phí</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}