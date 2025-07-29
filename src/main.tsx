import { createRoot } from 'react-dom/client'
import './global.css'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { AppRouter } from './router/AppRouter.tsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ToastContainer />
            <AppRouter />
        </PersistGate>
    </Provider>
)
