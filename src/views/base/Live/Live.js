import {
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormLabel, CFormInput, CRow, CCol, CCardHeader, CCard, CCardBody,
    CProgress, CProgressBar, CImage, CInputGroup
} from '@coreui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { db, storage } from '../../../firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp, query } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Body = () => {
    const collectionRef = collection(db, 'live');
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [eventData, setEventData] = useState({
        name: '', description: '', startDateTime: '', endDateTime: '', link: '', imageUrl: ''
    });
    const [myData, setMyData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadNow, setUploadNow] = useState(false);

    const getEventName = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collectionRef);
            const data = await getDocs(q);
            setMyData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Error fetching events: ", error);
        } finally {
            setLoading(false);
        }
    }, [collectionRef]);

    useEffect(() => {
        getEventName();
    }, [getEventName]);

    const handleEventChange = (field, value) => {
        setEventData((prev) => ({ ...prev, [field]: value }));
    };

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
        console.log('API Key:', process.env.VITE_FIREBASE_API_KEY);
    };

    const updateEvent = async (imageUrl) => {
        try {
            // Use the existing imageUrl if no new image was uploaded
            const finalImageUrl = imageUrl || eventData.imageUrl;

            await updateDoc(doc(db, 'live', editId), {
                name: eventData.name,
                description: eventData.description,
                startDateTime: Timestamp.fromDate(new Date(eventData.startDateTime)),
                endDateTime: Timestamp.fromDate(new Date(eventData.endDateTime)),
                link: eventData.link,
                imageUrl: finalImageUrl
            });

            setMyData((prev) =>
                prev.map((item) =>
                    item.id === editId
                        ? {
                            ...item,
                            name: eventData.name,
                            description: eventData.description,
                            startDateTime: Timestamp.fromDate(new Date(eventData.startDateTime)),
                            endDateTime: Timestamp.fromDate(new Date(eventData.endDateTime)),
                            link: eventData.link,
                            imageUrl: finalImageUrl
                        }
                        : item
                )
            );

            alert('Event updated successfully!');
        } catch (error) {
            console.error("Error updating event: ", error);
        } finally {
            resetForm();
        }
    };

    const uploadMedia = async (e) => {
        e.preventDefault();
        const file = e.target[0]?.files[0];

        if (!file) {
            // If no file is selected, directly call updateEvent with existing image
            if (editVisible) {
                updateEvent();
            } else {
                storeData();
            }
            return;
        }

        const storageRef = ref(storage, `live/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progressData);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (editVisible) {
                        updateEvent(downloadURL);
                    } else {
                        storeData(downloadURL);
                    }
                });
            }
        );
    };

    const storeData = async (imageUrl) => {
        if (!eventData.name || !eventData.description || !eventData.startDateTime || !eventData.endDateTime || !eventData.link) {
            return alert('Please fill all fields');
        }
        const ref = doc(collection(db, 'live'));
        try {
            await setDoc(ref, {
                id: ref.id,
                createAt: Timestamp.fromDate(new Date()),
                name: eventData.name,
                description: eventData.description,
                startDateTime: Timestamp.fromDate(new Date(eventData.startDateTime)),
                endDateTime: Timestamp.fromDate(new Date(eventData.endDateTime)),
                link: eventData.link,
                imageUrl: imageUrl
            });
            setMyData((prev) => [
                ...prev,
                {
                    id: ref.id,
                    createAt: Timestamp.fromDate(new Date()),
                    name: eventData.name,
                    description: eventData.description,
                    startDateTime: Timestamp.fromDate(new Date(eventData.startDateTime)),
                    endDateTime: Timestamp.fromDate(new Date(eventData.endDateTime)),
                    link: eventData.link,
                    imageUrl: imageUrl
                }
            ]);
            alert('New Event created!');
        } catch (error) {
            console.error("Error adding event: ", error);
        } finally {
            resetForm();
        }
    };



    const resetForm = () => {
        setVisible(false);
        setEditVisible(false);
        setEventData({ name: '', description: '', startDateTime: '', endDateTime: '', link: '', imageUrl: '' });
        setSelectedImage(null);
        setUploadProgress(0);
        setUploadNow(false);
    };

    const edit = async (id) => {
        try {
            const docSnap = await getDoc(doc(db, 'live', id));
            if (docSnap.exists()) {
                const { name, description, startDateTime, endDateTime, link, imageUrl } = docSnap.data();
                setEventData({
                    name,
                    description,
                    startDateTime: new Date(startDateTime.seconds * 1000).toISOString().slice(0, 16),
                    endDateTime: new Date(endDateTime.seconds * 1000).toISOString().slice(0, 16),
                    link,
                    imageUrl
                });
                setEditId(id);
                setEditVisible(true);
                setSelectedImage(imageUrl);
            }
        } catch (error) {
            console.error("Error fetching event for edit: ", error);
        }
    };

    const Delete = async () => {
        try {
            await deleteDoc(doc(db, 'live', editId));
            setMyData((prev) => prev.filter((item) => item.id !== editId));
            alert('Event deleted successfully!');
        } catch (error) {
            console.error("Error deleting event: ", error);
        } finally {
            resetForm();
        }
    };

    return (
        <>
            <CButton sm={8} onClick={() => setVisible(true)}>Add New</CButton>

            {/* Add event modal */}
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader><CModalTitle>New Event</CModalTitle></CModalHeader>
                <CModalBody>
                    {/* Event form fields */}
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Event Name</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.name} onChange={(e) => handleEventChange('name', e.target.value)} required /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Description</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.description} onChange={(e) => handleEventChange('description', e.target.value)} required /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Start Date & Time</CFormLabel>
                        <CCol sm={8}><CFormInput type="datetime-local" value={eventData.startDateTime} onChange={(e) => handleEventChange('startDateTime', e.target.value)} required /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">End Date & Time</CFormLabel>
                        <CCol sm={8}><CFormInput type="datetime-local" value={eventData.endDateTime} onChange={(e) => handleEventChange('endDateTime', e.target.value)} required /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Link</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.link} onChange={(e) => handleEventChange('link', e.target.value)} required /></CCol>
                    </CRow>

                    {/* Image Upload Section */}
                    {selectedImage ? (
                        <CRow className="mb-3 justify-content-center">
                            <CImage
                                align="center"
                                rounded
                                src={selectedImage}
                                width={200}
                                height={200}
                                style={{ objectFit: 'cover' }} // Ensures the image fits nicely
                            />
                        </CRow>
                    ) : null}

                    <form onSubmit={uploadMedia}>
                        <CRow className="mb-2">
                            <CCol md={12} className="position-relative">
                                <CInputGroup className="mb-1">
                                    <CFormInput
                                        type="file"
                                        id="inputGroupFile04"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="upload"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={imageChange}
                                    />
                                </CInputGroup>
                            </CCol>
                        </CRow>

                        <CRow className="mb-1">
                            <CCol md={12} className="position-relative">
                                <CProgress className="mb-1">
                                    <CProgressBar value={uploadProgress}>{uploadProgress}%</CProgressBar>
                                </CProgress>
                            </CCol>
                        </CRow>
                        {uploadNow === false ? (
                            <CModalFooter>
                                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                                    Save
                                </CButton>
                                <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                                {/* <CButton color="primary" onClick={storeData}>Save</CButton> */}
                            </CModalFooter>

                        ) : null}
                    </form>
                </CModalBody>
            </CModal>

            {/* Edit event modal */}
            <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
                <CModalHeader><CModalTitle>Update Event</CModalTitle></CModalHeader>
                <CModalBody>
                    {/* Event form fields */}
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Event Name</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.name} onChange={(e) => handleEventChange('name', e.target.value)} /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Description</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.description} onChange={(e) => handleEventChange('description', e.target.value)} /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Start Date & Time</CFormLabel>
                        <CCol sm={8}><CFormInput type="datetime-local" value={eventData.startDateTime} onChange={(e) => handleEventChange('startDateTime', e.target.value)} /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">End Date & Time</CFormLabel>
                        <CCol sm={8}><CFormInput type="datetime-local" value={eventData.endDateTime} onChange={(e) => handleEventChange('endDateTime', e.target.value)} /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-4">Link</CFormLabel>
                        <CCol sm={8}><CFormInput type="text" value={eventData.link} onChange={(e) => handleEventChange('link', e.target.value)} /></CCol>
                    </CRow>

                    {/* Image Upload Section for Edit */}
                    {selectedImage ? (
                        <CRow className="mb-3">
                            <CImage
                                align="center"
                                rounded
                                src={selectedImage}
                                width={200}
                                height={200}
                                style={{ objectFit: 'cover' }} // Ensures the image fits nicely
                            />                        </CRow>
                    ) : (
                        <CRow className="mb-3">
                            <CImage align="center"
                                rounded
                                width={200}
                                height={200}
                                src={eventData.imageUrl} />
                        </CRow>
                    )}

                    <form onSubmit={uploadMedia}>
                        <CRow className="mb-2">
                            <CCol md={12} className="position-relative">
                                <CInputGroup className="mb-1">
                                    <CFormInput
                                        type="file"
                                        id="inputGroupFile04"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="upload"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={imageChange}
                                    />
                                </CInputGroup>
                            </CCol>
                        </CRow>

                        <CRow className="mb-1">
                            <CCol md={12} className="position-relative">
                                <CProgress className="mb-1">
                                    <CProgressBar value={uploadProgress}>{uploadProgress}%</CProgressBar>
                                </CProgress>
                            </CCol>
                        </CRow>
                        {uploadNow === false ? (

                            <CModalFooter>
                                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                                    Update
                                </CButton>
                                <CButton color="danger" onClick={Delete}>Delete</CButton>
                                {/* <CButton type="submit" color="primary" onClick={updateEvent}>Update</CButton> */}
                            </CModalFooter>
                        ) : null}
                    </form>
                </CModalBody>

            </CModal>

            {/* Events table */}
            <CTable>
                <CTableHead color="light">
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Event Name</CTableHeaderCell>
                        <CTableHeaderCell>Start Date & Time</CTableHeaderCell>
                        <CTableHeaderCell>End Date & Time</CTableHeaderCell>
                        <CTableHeaderCell>Link</CTableHeaderCell>
                        {/* <CTableHeaderCell>Image</CTableHeaderCell> */}
                        <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {myData.map((data, index) => (
                        <CTableRow key={data.id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{data.name}</CTableDataCell>
                            <CTableDataCell>{data.startDateTime ? new Date(data.startDateTime.seconds * 1000).toLocaleString() : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{data.endDateTime ? new Date(data.endDateTime.seconds * 1000).toLocaleString() : 'N/A'}</CTableDataCell>
                            <CTableDataCell><a href={data.link} target="_blank" rel="noopener noreferrer">Click here</a></CTableDataCell>
                            {/* <CTableDataCell>
                                {data.imageUrl ? (
                                    <CImage align="center" rounded src={data.imageUrl} style={{ width: '100px', height: 'auto' }} />
                                ) : 'No Image'}
                            </CTableDataCell> */}
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

const Live = () => (
    <CRow>
        <CCol xs={12}>
            <CCard className="mb-4">
                <CCardHeader><h2>Events</h2></CCardHeader>
                <CCardBody>{<Body />}</CCardBody>
            </CCard>
        </CCol>
    </CRow>
);

export default Live;