/**
 * IMPORTS
 */
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LoginImage from "assets/login-background.svg";
import { Button } from "components/button";
import { Field } from "components/form/field";
import { Input } from "components/form/input";
import { selectIsLoading } from "features/notify/selectors";
import user from "features/user";
import { LoginLayout } from "layouts/LoginLayout"
import { schema } from "./schema";
import { $Form } from "./styles";

/**
 * I am the login page
 */
export const LoginPage = () => {

    // get dispatch
    const dispatch = useDispatch();

    // use form
    const { errors, handleSubmit, register } = useForm({
        resolver: yupResolver(schema)

    });

    const isLoading = useSelector(selectIsLoading);

    // handle form submit
    const onSubmit = (data: any): void => {
        // dispatch action to login user
        dispatch(user.actions.update({
            username: data.username,
            signed: true,
          }));
    };

    return (
        <LoginLayout leftImage={LoginImage}>
            <h1>inTime</h1>
            <p>O lugar perfeito para você ganhar tempo</p>
            <$Form onSubmit={handleSubmit(onSubmit)}>
                <Field error={errors.username?.message} label="Usuário">
                    <Input name="username" innerRef={register} />
                </Field>

                <Field error={errors.password?.message} label="Senha">
                    <Input name="password" innerRef={register} type="password" />
                </Field>
                <Button disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
            </$Form>
        </LoginLayout>
    )
}