import React, { useEffect, useState, useMemo } from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CCol, CRow,
  CFormSelect, CButton, CBadge
} from '@coreui/react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import DatePicker from 'react-datepicker';
import Loading from 'src/components/loading/Loading';
import 'react-datepicker/dist/react-datepicker.css';

const UserData = () => {
  const [myData, setMyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subscriptionType: '',
    searchEmail: '',
    searchPhone: '',
    startDate: null,
  });

  // Data Fetching
  const fetchData = async () => {
    setLoading(true);
    try {
      const userQuery = query(collection(db, 'webAppUsers'));
      const userData = await getDocs(userQuery);
      setMyData(userData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return myData
      .filter(data =>
        filters.subscriptionType === '' ||
        (data.subscription?.planType || 'None') === filters.subscriptionType
      )
      .filter(data =>
        !filters.searchEmail ||
        data.email?.toLowerCase().includes(filters.searchEmail.toLowerCase())
      )
      .filter(data =>
        !filters.searchPhone ||
        data.phoneNumber?.toLowerCase().includes(filters.searchPhone.toLowerCase())
      )
      .filter(data =>
        !filters.startDate ||
        new Date(data.subscription?.planStartDate || '1970-01-01') >= filters.startDate
      )
      .sort((a, b) =>
        new Date(b.subscription?.planStartDate || '1970-01-01') -
        new Date(a.subscription?.planStartDate || '1970-01-01')
      );
  }, [myData, filters]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    const header = ['Email', 'Phone No', 'Plan Type', 'Start Date', 'End Date', 'Status'];
    const rows = filteredData.map(data => [
      data.email || 'N/A',
      data.phoneNumber || 'N/A',
      data.subscription?.planType || 'None',
      data.subscription?.planStartDate || 'N/A',
      data.subscription?.planEndDate || 'N/A',
      data.subscription?.status || 'N/A',
    ]);

    const csvData = [header, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
    link.download = 'user_data.csv';
    link.click();
  };

  if (loading) return <Loading />;

  return (
    <CRow>
      <CCol>
        {/* Filters */}
        <CRow className="mb-3">
          <CCol md={3}>
            <CFormSelect
              onChange={(e) => handleFilterChange('subscriptionType', e.target.value)}
              value={filters.subscriptionType}
            >
              <option value="">All Plans</option>
              <option value="Free Trial">Free Trial</option>
              <option value="Monthly">Monthly</option>
              <option value="3 Months">3 Months</option>
            </CFormSelect>
          </CCol>
          <CCol md={2}>
            <input
              placeholder="Search Email"
              onChange={(e) => handleFilterChange('searchEmail', e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <input
              placeholder="Search Phone"
              onChange={(e) => handleFilterChange('searchPhone', e.target.value)}
            />
          </CCol>
          <CCol>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Start Date"
            />
          </CCol>
          <CCol>
            <CButton onClick={handleExport}>Export CSV</CButton>
          </CCol>
        </CRow>

        {/* Data Table */}
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Plan Type</CTableHeaderCell>
              <CTableHeaderCell>Start Date</CTableHeaderCell>
              <CTableHeaderCell>End Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map(data => (
              <CTableRow key={data.id}>
                <CTableHeaderCell>{data.email || 'N/A'}</CTableHeaderCell>
                <CTableHeaderCell>{data.phoneNumber || 'N/A'}</CTableHeaderCell>
                <CTableHeaderCell>{data.subscription?.planType || 'None'}</CTableHeaderCell>
                <CTableHeaderCell>{data.subscription?.planStartDate || 'N/A'}</CTableHeaderCell>
                <CTableHeaderCell>{data.subscription?.planEndDate || 'N/A'}</CTableHeaderCell>
                <CTableHeaderCell>
                  <CBadge color={data.subscription?.status === 'active' ? 'success' : 'warning'}>
                    {data.subscription?.status || 'N/A'}
                  </CBadge>
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  );
};

export default UserData;
