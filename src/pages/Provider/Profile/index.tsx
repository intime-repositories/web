import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "components/title"
import { ICategory, IProvider } from "constants/types";
import { selectUser } from "features/user/selectors";
import http from "infra/http";
import { notify } from "infra/notify";
import { Content } from "layouts/MainLayout/content"
import { editSchema } from "templates/ProviderForm/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ProviderForm } from "templates/ProviderForm";
import { $AvatarContainer, $ProfileContainer, $Form, $Divisor } from "./styles";
import { Button } from "components/button";
import { MdCameraAlt } from "react-icons/md";
import { Avatar } from "components/avatar";
import { FilePicker } from "components/form/filepicker";
import { AddressForm } from "templates/AddressForm";
import { getFormFile } from "utils/getFormFile";
import { selectIsLoading } from "features/notify/selectors";
import { IOption } from "components/form/select/select.d";

export const ProviderProfile = () => {

    // get dispatch
    const dispatch = useDispatch();

    const { id } = useSelector(selectUser);

    const isLoading = useSelector(selectIsLoading);

    const [provider, setProvider] = useState<IProvider>(null);

    const [photo, setPhoto] = useState(null);

    // use form
    const { control, errors, handleSubmit, register, trigger } = useForm({
        resolver: yupResolver(editSchema)

    });

    useEffect(() => {
        (async () => {
            try {
                const response: IProvider = await http.get(`provider/${id}/`, { dispatch });

                if (!response)
                    throw Error;

                setProvider(response)
            }
            catch (ex) {
                notify({
                    title: 'Não foi possível resgatar os dados do perfil',
                    message: 'Tente novamente mais tarde',
                    type: 'danger'
                })
            }
        })()
    }, [])

    const [categories, setCategories] = useState<IOption[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await http.get('category', { dispatch });

                if (!response)
                    throw Error

                let formattedCategories: IOption[] = response.map((category: ICategory) => { return { name: category.name, value: category.id } });
                formattedCategories.unshift({ name: "", value: null });

                setCategories(formattedCategories);
            }
            catch (ex) {
                notify({
                    title: 'Não foi possível resgatar as categorias de serviço',
                    message: 'Tente novamente mais tarde',
                    type: 'danger'
                })
            }
        })()
    }, []);

    const onPick = async (file) => {
        const isValid = await trigger('photo');

        if (!isValid)
            return setPhoto(null);

        setPhoto(file);
    }

    const onSubmit = async (data: any): Promise<void> => {
        try {
            let photoUrl = await getFormFile(data.photo[0], dispatch);

            if (!photoUrl)
                photoUrl = provider?.photo;

            let response = null;

            const body = {
                fullname: data.fullname,
                birthDate: data.birthDate,
                email: data.email,
                category: data.category,
                cpf: data.cpf,
                phone: data.phone,
                photo: photoUrl,
                address: {
                    id: provider.address.id,
                    street: data.street,
                    number: data.number,
                    district: data.district,
                    complement: data.complement,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode
                }
            }

            response = await http.put(`provider/${id}/`, { body, dispatch });

            if (!response)
                throw Error;

            notify({
                title: `Sucesso!`,
                message: 'Perfil atualizado com sucesso',
                type: 'success'
            });
        }
        catch (ex) {
            console.log(ex);
            notify({
                title: 'Não foi possível salvar o perfil',
                message: 'Tente novamente mais tarde',
                type: 'danger'
            })
        }
    }

    return (
        <Content fixed={
            <Title
                title="Seu Perfil"
                subtitle="Aqui você poderá checar seus dados pessoais"
            />
        }>
            <$ProfileContainer>

                <$Form onSubmit={handleSubmit(onSubmit)}>
                    <$AvatarContainer>
                        <Avatar src={photo?.url || provider?.photo} size="200px" />
                        <FilePicker
                            name="photo"
                            innerRef={register}
                            onPick={onPick}
                            icon={<MdCameraAlt />}
                        >
                            Selecionar avatar
                        </FilePicker>
                    </$AvatarContainer>
                    {provider &&
                        <ProviderForm
                            control={control}
                            errors={errors}
                            register={register}
                            provider={provider}
                            isEditing={true}
                            categories={categories}
                        />
                    }
                    <$Divisor>
                        Endereço do Estabelecimento
                    </$Divisor>
                    {provider?.address &&
                        <AddressForm
                            control={control}
                            errors={errors}
                            register={register}
                            address={provider?.address}
                        />
                    }
                    <Button disabled={isLoading}>
                        Salvar
                    </Button>
                </$Form>
            </$ProfileContainer>
        </Content>
    )
}