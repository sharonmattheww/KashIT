import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import Modal from '../Modal.jsx';
import TransactionForm from '../TransactionForm.jsx';

// The app shell. It owns the add/edit modal so both the top bar button and any
// row's edit button can open it, and passes `openForm` down to the routed pages
// through the router's outlet context.
export default function AppLayout() {
  const [formState, setFormState] = useState({ open: false, editing: null });

  const openForm = (transaction = null) => setFormState({ open: true, editing: transaction });
  const closeForm = () => setFormState({ open: false, editing: null });

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar onAdd={() => openForm()} />
        <div className="main__content">
          <Outlet context={{ openForm }} />
        </div>
      </main>

      <Modal
        open={formState.open}
        onClose={closeForm}
        title={formState.editing ? 'Edit transaction' : 'Add transaction'}
      >
        <TransactionForm initial={formState.editing} onClose={closeForm} />
      </Modal>
    </div>
  );
}
