import React, { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Admin/AdminContainer';

const ONE_HOUR = 3600000; // 1 hour in milliseconds

const AdminDashboard = () => {
    const [emails, setEmails] = useState([]);
    const [stats, setStats] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectAll, setSelectAll] = useState(false); // New state for "Select All" checkbox

    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/quotations');
                const data = await response.json();
                
                const sortedQuotations = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const now = new Date();
                const updatedEmails = sortedQuotations.map(quotation => {
                    const createdAt = new Date(quotation.createdAt);
                    const isNew = now - createdAt < ONE_HOUR;
                    const status = isNew ? 'New' : (quotation.verified ? 'Clicked' : 'Pending');
                    
                    return {
                        id: quotation._id,
                        sender: quotation.name,
                        subject: `Quotation for ${quotation.service}`,
                        time: createdAt.toLocaleTimeString(),
                        status: isNew ? status : ''
                    };
                });
                setEmails(updatedEmails);
            } catch (error) {
                console.error('Failed to fetch quotations', error);
            }
        };

        fetchQuotations();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAllChange = () => {
        if (!selectAll) {
            setSelectedIds(emails.map(email => email.id)); // Select all
        } else {
            setSelectedIds([]); // Deselect all
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selectedIds.map(id => 
                fetch(`http://localhost:5000/api/users/quotations/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
            ));
            setEmails(emails.filter(email => !selectedIds.includes(email.id)));
            setSelectedIds([]);
            setSelectAll(false); // Deselect all after delete
        } catch (error) {
            console.error('Failed to delete quotations', error);
        }
    };

    const handleEmailClick = () => {
        window.open('https://mail.google.com/mail/u/2/#inbox', '_blank');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/stats');
                const data = await response.json();
                setStats([
                    { label: 'Quotations', value: data.quotations }, 
                    { label: 'Services', value: '4' }, 
                    { label: 'Products', value: data.products },
                    { label: 'Projects', value: data.projects },
                    { label: 'Webinars', value: data.webinars }
                ]);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();
    }, []);

    const services = ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'];

    const filteredEmails = emails.filter(email =>
        email.sender.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <Layout>
            {/* Statistics Section */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                {stats.map((stat, index) => (
                    <div key={index} className={`flex-1 text-center ${index !== stats.length - 1 ? 'border-r border-gray-200' : ''}`}>
                        <p className="text-gray-500 text-sm md:text-base">{stat.label}</p>
                        <h4 className="text-2xl font-bold text-red-700 md:text-2xl">{stat.value}</h4>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Emails Section */}
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-6">
                        {/* Select All Checkbox */}
                        <input
    type="checkbox"
    className="mr-3 w-4 h-4"  // Increase the size of the checkbox
    checked={selectAll}
    onChange={handleSelectAllChange}
/>
                        <input
                            type="text"
                            placeholder="Search quotation"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                        />
                        <div className="flex ml-4 space-x-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 cursor-pointer" onClick={handleEmailClick} />
                            <FontAwesomeIcon icon={faTrash} className="text-gray-500 cursor-pointer" onClick={handleDelete} />
                        </div>
                    </div>
                    {filteredEmails.map((email, index) => (
    <div
        key={index}
        className={`flex items-center border-b border-gray-200 py-4 cursor-pointer ${selectedIds.includes(email.id) ? 'bg-gray-100' : ''}`}
        onClick={() => handleEmailClick(email.id)}  // Add onClick handler
    >
        <input
            type="checkbox"
            className="mr-4"
            checked={selectedIds.includes(email.id)}
            onChange={(e) => {
                e.stopPropagation();  // Prevent triggering the row click when checking the checkbox
                handleCheckboxChange(email.id);
            }}
        />
        <p className="flex-1 truncate text-gray-700 text-sm md:text-base">{email.sender}</p>
        {email.status && (
            <span className={`px-3 py-1 rounded-full text-white mr-4 ${email.status === 'New' ? 'bg-teal-400' : 'bg-red-400'}`}>
                {email.status}
            </span>
        )}
        <p className="flex-1 truncate text-gray-500 text-sm md:text-base">{email.subject}</p>
        <p className="text-gray-500 text-sm md:text-base">{email.time}</p>
    </div>
))}

                </div>

                {/* Manage Services Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="text-gray-700 font-semibold text-sm md:text-base">Manage Services</h6>
                        <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200">
                            <option>Sort by</option>
                        </select>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                <th className="pb-2 text-sm md:text-base">Name</th>
                                <th className="pb-2 text-right text-sm md:text-base">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2 text-sm md:text-base">{service}</td>
                                    <td className="py-2 text-right space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
