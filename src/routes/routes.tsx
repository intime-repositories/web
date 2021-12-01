/**
 * IMPORTS
 */
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { selectUser } from "features/user/selectors";
import { RoleEnum } from "features/user/index.d"
import { MainLayout } from "layouts/MainLayout";
import { ClientHome } from "pages/Client/Home";
import { LoginPage } from "pages/LoginPage";
import { ProviderHome } from "pages/Provider/Home";
import { IRoutesProps } from "./routes.d";
import { ClientJoin } from "pages/Client/Join";
import { ProviderJoin } from "pages/Provider/Join";
import { ListServices } from "pages/Provider/Services";

const Routes = (props: IRoutesProps) => {

    const { signed, role } = useSelector(selectUser);

    return (
        <BrowserRouter >
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    key={props.basename}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {signed ?
                        <MainLayout>
                            {role === RoleEnum.PROVIDER &&
                                <>
                                    <Route path="/" exact component={ProviderHome} />
                                    <Route path="/services" exact component={ListServices} />
                                </>
                            }
                            {role === RoleEnum.CLIENT &&
                                <>
                                    <Route path="/" exact component={ClientHome} />
                                </>
                            }
                        </MainLayout>
                        :
                        <>
                            <Route path="/" exact component={LoginPage} />
                            <Route path="/join" exact component={ClientJoin} />
                            <Route path="/join-provider" exact component={ProviderJoin} />
                        </>
                    }
                </motion.div>
            </AnimatePresence>
        </BrowserRouter>
    )
}

/**
 * EXPORTS
 */
export { Routes }