import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormLabel, CFormInput, CRow, CCol, CCardHeader, CCard, CCardBody } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp, query } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

const Body = () => {
  const params = useParams(); // Get params from URL
  const history = useNavigate();
  const collectionRef = collection(db, 'agents');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [agentName, setAgentName] = useState(''); // Agent name state
  const [fixDigit, setFixDigit] = useState(''); // Fixed digit state
  const [myData, setMyData] = useState([]); // Store fetched agents
  const [editId, setEditId] = useState(); // ID of agent being edited

  // Fetch all agents
  const getAgentName = () => {
    setLoading(true);
    const q = query(collectionRef);
    getDocs(q).then((data) => {
      setMyData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
  };

  useEffect(() => { getAgentName(); }, []);

  // Add new agent
  const StoreData = async () => {
    if (!agentName || !fixDigit) return alert('Please fill all fields');
    const ref = doc(collection(db, 'agents'));
    await setDoc(ref, { id: ref.id, createAt: Timestamp.fromDate(new Date()), name: agentName, fixdDigit: fixDigit });
    alert('New Agent created!');
    setVisible(false);
    getAgentName();
  };

  // Edit agent
  const edit = async (id) => {
    const docSnap = await getDoc(doc(db, 'agents', id));
    if (docSnap.exists()) {
      const { name, fixdDigit } = docSnap.data();
      setAgentName(name);
      setFixDigit(fixdDigit);
      setEditId(id);
      setEditVisible(true);
    }
  };

  // Update agent details
  const update = async () => {
    await updateDoc(doc(db, 'agents', editId), { name: agentName, fixdDigit: fixDigit });
    setEditVisible(false);
    getAgentName();
  };

  // Delete agent
  const Delete = async () => {
    await deleteDoc(doc(db, 'agents', editId));
    setEditVisible(false);
    getAgentName();
  };

  // Toggle visibility for modals
  const handleVisible = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <>
      <CButton sm={8} onClick={handleVisible}>Add New</CButton>
      {/* Add agent modal */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader><CModalTitle>New Agent</CModalTitle></CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4">AGENT NAME</CFormLabel>
            <CCol sm={8}><CFormInput type="text" onChange={(e) => setAgentName(e.target.value)} required /></CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4">FIXED DIGIT</CFormLabel>
            <CCol sm={8}><CFormInput type="number" onChange={(e) => setFixDigit(e.target.value)} required /></CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>Close</CButton>
          <CButton color="primary" onClick={StoreData}>Save</CButton>
        </CModalFooter>
      </CModal>
      {/* Edit agent modal */}
      <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader><CModalTitle>Update</CModalTitle></CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4">AGENT NAME</CFormLabel>
            <CCol sm={8}><CFormInput type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} /></CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4">FIXED DIGIT</CFormLabel>
            <CCol sm={8}><CFormInput type="number" value={fixDigit} onChange={(e) => setFixDigit(e.target.value)} /></CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={Delete}>Delete</CButton>
          <CButton color="primary" onClick={update}>Update</CButton>
        </CModalFooter>
      </CModal>
      {/* Agents table */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>AGENT NAME</CTableHeaderCell>
            <CTableHeaderCell>JOINED DATE</CTableHeaderCell>
            <CTableHeaderCell>FIXED DIGIT</CTableHeaderCell>
            <CTableHeaderCell>ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => (
            <CTableRow key={data.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{data.name}</CTableDataCell>
              <CTableDataCell>{data.createAt ? new Date(data.createAt.seconds * 1000).toLocaleDateString() : 'N/A'}</CTableDataCell>
              <CTableDataCell>{data.fixdDigit}</CTableDataCell>
              <CTableDataCell>
                <CButton color="success" onClick={() => edit(data.id)}>Edit</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  );
};

const Agents = () => (
  <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader><h2>Agents</h2></CCardHeader>
        <CCardBody>{Body()}</CCardBody>
      </CCard>
    </CCol>
  </CRow>
);

export default Agents;
