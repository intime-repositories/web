/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "components/button";
import { Field } from "components/form/field";
import { Input } from "components/form/input";
import { Select } from "components/form/select";
import { Modal } from "components/modal"
import { $ModalForm } from "components/modal/styles";
import { paymentTypes } from "constants/paymentTypes";
import { selectIsLoading } from "features/notify/selectors";
import { selectUser } from "features/user/selectors";
import http from "infra/http";
import { notify } from "infra/notify";
import { addMinutes } from "utils/dateUtils";
import { ISchedulingModalProps } from "./index.d";
import { schema } from "./schema"
import { Row } from "components/form/row";
import { $Error } from "styles/utils";
import { TextViewer } from "components/textviewer";

/**
 * I am the scheduling modal from
 */
export const SchedulingModal = (props: ISchedulingModalProps) => {
    const { service } = props;

    // get dispatch
    const dispatch = useDispatch();

    // use form
    const { watch, errors, handleSubmit, register } = useForm({
        resolver: yupResolver(schema)
    });

    const watchStartDate = watch("startDate", null);
    const [endDate, setEndState] = useState(null);
    const [available, setAvailable] = useState(true);
    const [isValidDate, setIsValidDate] = useState(true);

    const address = service?.provider.address;

    useEffect(() => {
        const date = new Date(watchStartDate);
        const now = new Date();

        if (date <= now)
            setIsValidDate(false)

        else {
            setEndState(addMinutes(watchStartDate, service?.duration));
            setIsValidDate(true)
        }

    }, [watchStartDate])

    useEffect(() => {
        if (endDate)
            (async () => {
                try {
                    const body = {
                        startDate: watchStartDate,
                        endDate,
                        providerId: service?.provider?.id
                    }

                    const response = await http.post('scheduling/check', { body, dispatch });

                    if (!response)
                        throw Error;

                    setAvailable(!!response?.isAvailable);
                }
                catch (ex) {
                    notify({
                        title: 'N??o foi poss??vel checar se o hor??rio est?? dispon??vel',
                        message: 'Tente novamente mais tarde',
                        type: 'danger'
                    })
                }
            })()
    }, [endDate])

    const { id } = useSelector(selectUser);

    const isLoading = useSelector(selectIsLoading);

    // handle form submit
    const onSubmit = async (data: any): Promise<void> => {
        try {
            let response = null;

            const body = {
                ...data,
                endDate,
                client: { id },
                product: { id: service.id },
            }

            response = await http.post(`scheduling`, { body, dispatch });

            if (!response)
                throw Error;

            notify({
                title: `Sucesso!`,
                message: 'Agendamento realizado, voc?? pode visualiza-lo na op????o "Agenda" do menu',
                type: 'success',
                duration: 10000
            });

            props.setIsOpen(false);
        }
        catch (ex) {
            notify({
                title: 'N??o foi poss??vel realizar o agendamento',
                message: 'Tente novamente mais tarde',
                type: 'danger'
            })
        }
    };

    return (
        <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
            <$ModalForm onSubmit={handleSubmit(onSubmit)}>
                <p>Agendar</p>
                <h1>{service?.name}</h1>
                <p>{service?.description}</p><br />
                <h3>R$ {service?.price}</h3>
                <small>{service?.provider?.fullname}</small>
                <TextViewer label="Endere??o" text={`${address?.street}, ${address?.number} - ${address?.district}, ${address?.city} - ${address?.state}`} copyButton={true} />

                <Field error={errors.payment?.message} label="Pagamento">
                    <Select
                        name="payment"
                        innerRef={register}
                        options={paymentTypes}
                    />
                </Field>

                <Row>
                    <Field error={errors.startDate?.message} label="Hor??rio">
                        <Input
                            name="startDate"
                            innerRef={register}
                            type="datetime-local"
                        />
                    </Field>

                    <Field error={errors.endDate?.message} label="T??rmino">
                        <Input
                            name="endDate"
                            innerRef={register}
                            type="datetime-local"
                            value={endDate}
                            disabled
                        />
                    </Field>
                </Row>

                {watchStartDate &&
                    <>
                        {!available &&
                            <$Error>Hor??rio indispon??vel, por favor tente selecionar um hor??rio diferente</$Error>
                        }
                        {!isValidDate &&
                            <$Error>Por favor, selecione um hor??rio posterior ao momento atual</$Error>
                        }
                    </>
                }


                <Button disabled={isLoading || !available || !isValidDate}>
                    {isLoading ? 'Criando...' : 'Criar'}
                </Button>
            </$ModalForm >
        </Modal>
    )
}