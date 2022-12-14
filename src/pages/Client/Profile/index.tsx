import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "components/title"
import { IClient } from "constants/types";
import { selectUser } from "features/user/selectors";
import http from "infra/http";
import { notify } from "infra/notify";
import { Content } from "layouts/MainLayout/content"
import { editSchema } from "templates/ClientForm/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ClientForm } from "templates/ClientForm";
import { $AvatarContainer, $ProfileContainer, $Form } from "pages/Provider/Profile/styles";
import { Button } from "components/button";
import { MdCameraAlt } from "react-icons/md";
import { Avatar } from "components/avatar";
import { FilePicker } from "components/form/filepicker";
import { getFormFile } from "utils/getFormFile";
import { selectIsLoading } from "features/notify/selectors";
import { AddressForm } from "templates/AddressForm";

export const ClientProfile = () => {

    // get dispatch
    const dispatch = useDispatch();

    const isLoading = useSelector(selectIsLoading);

    const { id } = useSelector(selectUser);

    const [client, setClient] = useState<IClient>(null);

    const [photo, setPhoto] = useState(null);

    // use form
    const { control, errors, handleSubmit, register, trigger } = useForm({
        resolver: yupResolver(editSchema)

    });

    useEffect(() => {
        (async () => {
            try {
                const response: IClient = await http.get(`client/${id}/`, { dispatch });

                if (!response)
                    throw Error;

                setClient(response)
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
                photoUrl = client?.photo;

            let response = null;

            const body = {
                fullname: data.fullname,
                birthDate: data.birthDate,
                email: data.email,
                phone: data.phone,
                photo: photoUrl,
                address: {
                    id: client?.address?.id,
                    street: data.street,
                    number: data.number,
                    district: data.district,
                    complement: data.complement,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode
                }
            }

            response = await http.put(`client/${id}/`, { body, dispatch });

            setClient({ ...client, address: { ...client.address, id: response?.client?.address?.id } });

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
                        <Avatar src={photo?.url || client?.photo} size="200px" />
                        <FilePicker
                            name="photo"
                            innerRef={register}
                            onPick={onPick}
                            icon={<MdCameraAlt />}
                        >
                            Selecionar avatar
                        </FilePicker>
                    </$AvatarContainer>
                    {client &&
                        <>
                            <ClientForm
                                control={control}
                                errors={errors}
                                register={register}
                                client={client}
                                isEditing={true}
                            />
                            <AddressForm
                                control={control}
                                errors={errors}
                                register={register}
                                address={client?.address}
                            />
                        </>
                    }
                    <Button disabled={isLoading}>
                        Salvar
                    </Button>
                </$Form>
            </$ProfileContainer>
        </Content>
    )
}