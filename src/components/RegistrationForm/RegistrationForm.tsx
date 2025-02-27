import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import "./RegistrationForm.scss";

const registrationSchema = z.object({
  firstName: z.string().min(2, "Мінімум 2 символи"),
  lastName: z.string().min(2, "Мінімум 2 символи"),
  emailOrPhone: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
  birthDate: z.string().nonempty("Виберіть дату народження"),
  gender: z.enum(["male", "female", "other"], { required_error: "Оберіть стать" }),
});

type FormData = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Форма успішно відправлена:", data);
  };

  return (
    <div className="registration-container">
      {Object.keys(errors).length === 0 && <h1 className="site-title">GN</h1>}
      <div className="registration-box">
        <h2 className="title">Реєстрація</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <div className="name-fields">
            <div className="input-group">
              <input type="text" placeholder="Ім'я" {...register("firstName")} />
              <p className="error">{errors.firstName?.message}</p>
            </div>
            <div className="input-group">
              <input type="text" placeholder="Прізвище" {...register("lastName")} />
              <p className="error">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Електронна пошта або телефон" {...register("emailOrPhone")} />
            <p className="error">{errors.emailOrPhone?.message}</p>
          </div>

          <div className="input-group">
            <input type="password" placeholder="Новий пароль" {...register("password")} />
            <p className="error">{errors.password?.message}</p>
          </div>

          <div className="input-group">
            <select {...register("birthDate")}>
              <option className="sOption" value="">Оберіть дату народження</option>
              <option className="sOption" value="2000-01-01">1 Січня 2000</option>
              <option className="sOption" value="1995-05-20">20 Травня 1995</option>
              <option className="sOption" value="1990-07-15">15 Липня 1990</option>
            </select>
            <p className="error">{errors.birthDate?.message}</p>
          </div>

          <div className="gender-options">
            <label>
              <input type="radio" value="male" {...register("gender")} />
              Чоловік
            </label>
						<label>
              <input type="radio" value="other" {...register("gender")} />
              🫣
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} />
              Жінка
            </label>
          </div>
          <p className="error">{errors.gender?.message}</p>

          <button type="submit" className="submit-btn">Зареєструватися</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
