import { FormControl } from "@angular/forms";

export interface RegisterForm {
  nombre: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  password2: FormControl<string>;
  terminos: FormControl<string>;
}
