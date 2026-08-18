import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import {
    Users,
    DollarSign,
    Building2,
    Search,
    Pencil,
    LayoutDashboard
} from 'lucide-react';

import './styles.css';

const API =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080/api';

const DEPARTMENTS = [
    'Engineering',
    'Product',
    'Finance',
    'Sales',
    'Marketing',
    'HR',
    'Operations',
    'Legal',
    'Customer Success'
];

const COUNTRIES = [
    'USA',
    'Canada',
    'India',
    'UK',
    'Germany',
    'Australia',
    'Singapore',
    'Brazil'
];

const CURRENCIES = [
    'USD',
    'CAD',
    'INR',
    'GBP',
    'EUR',
    'AUD',
    'SGD',
    'BRL'
];

const USD_RATES = {
    USD: 1,
    CAD: 0.73,
    INR: 0.012,
    GBP: 1.29,
    EUR: 1.09,
    AUD: 0.66,
    SGD: 0.75,
    BRL: 0.18
};

const money = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(Number(value || 0));

function App() {
    const [tab, setTab] = useState('dashboard');

    const [summary, setSummary] = useState({});
    const [deps, setDeps] = useState([]);

    const [employees, setEmployees] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0
    });

    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');

    const [editing, setEditing] = useState(null);

    const [dashboardLoading, setDashboardLoading] =
        useState(true);

    const [employeeLoading, setEmployeeLoading] =
        useState(true);

    const loadDash = async () => {
        setDashboardLoading(true);

        try {
            const summaryResponse = await fetch(
                `${API}/analytics/summary`
            );

            const departmentResponse = await fetch(
                `${API}/analytics/departments`
            );

            if (!summaryResponse.ok) {
                throw new Error(
                    `Summary API failed: HTTP ${summaryResponse.status}`
                );
            }

            if (!departmentResponse.ok) {
                throw new Error(
                    `Department API failed: HTTP ${departmentResponse.status}`
                );
            }

            const summaryData =
                await summaryResponse.json();

            const departmentData =
                await departmentResponse.json();

            console.log(
                'Dashboard summary:',
                summaryData
            );

            console.log(
                'Department analytics:',
                departmentData
            );

            setSummary(summaryData || {});

            setDeps(
                Array.isArray(departmentData)
                    ? departmentData
                    : []
            );

        } catch (error) {
            console.error(
                'Dashboard loading failed:',
                error
            );

            setSummary({});
            setDeps([]);

        } finally {
            setDashboardLoading(false);
        }
    };

    const loadEmployees = async () => {
        setEmployeeLoading(true);

        try {
            const query =
                new URLSearchParams({
                    page: page.toString(),
                    size: '100',
                    sort: 'lastName,asc'
                });

            if (search.trim()) {
                query.set(
                    'search',
                    search.trim()
                );
            }

            if (department) {
                query.set(
                    'department',
                    department
                );
            }

            const response = await fetch(
                `${API}/employees?${query.toString()}`
            );

            if (!response.ok) {
                throw new Error(
                    `Employee API failed: HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(
                'Employee API response:',
                data
            );

            setEmployees({
                content:
                    data.content || [],
                totalPages:
                    data.totalPages || 0,
                totalElements:
                    data.totalElements || 0
            });

        } catch (error) {
            console.error(
                'Employee loading failed:',
                error
            );

            setEmployees({
                content: [],
                totalPages: 0,
                totalElements: 0
            });

        } finally {
            setEmployeeLoading(false);
        }
    };

    useEffect(() => {
        loadDash();
    }, []);

    useEffect(() => {
        loadEmployees();
    }, [
        page,
        search,
        department
    ]);

    const save = async (event) => {
        event.preventDefault();

        const form =
            new FormData(
                event.currentTarget
            );

        const body =
            Object.fromEntries(
                form.entries()
            );

        body.employeeNumber =
            body.employeeNumber.trim();

        body.firstName =
            body.firstName.trim();

        body.lastName =
            body.lastName.trim();

        body.email =
            body.email.trim();

        body.department =
            body.department.trim();

        body.jobTitle =
            body.jobTitle.trim();

        body.country =
            body.country.trim();

        body.currency =
            body.currency
                .trim()
                .toUpperCase();

        body.salaryAmount =
            Number(
                body.salaryAmount
            );

        body.normalizedSalaryUsd =
            Number(
                body.normalizedSalaryUsd
            );

        if (
            !body.employeeNumber ||
            !body.firstName ||
            !body.lastName ||
            !body.email ||
            !body.department ||
            !body.jobTitle ||
            !body.country ||
            !body.currency
        ) {
            alert(
                'Please complete all required fields.'
            );

            return;
        }

        if (
            !Number.isFinite(body.salaryAmount) ||
            body.salaryAmount <= 0
        ) {
            alert(
                'Local salary must be greater than zero.'
            );

            return;
        }

        if (
            !Number.isFinite(body.normalizedSalaryUsd) ||
            body.normalizedSalaryUsd <= 0
        ) {
            alert(
                'USD salary must be greater than zero.'
            );

            return;
        }

        const method =
            editing?.id
                ? 'PUT'
                : 'POST';

        const url =
            editing?.id
                ? `${API}/employees/${editing.id}`
                : `${API}/employees`;

        try {
            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(body)
                    }
                );

            if (!response.ok) {
                let errorBody = null;

                try {
                    errorBody =
                        await response.json();
                } catch {
                    console.error(
                        'Backend returned non-JSON error.'
                    );
                }

                console.error(
                    'Save employee failed:',
                    response.status,
                    errorBody
                );

                if (errorBody?.fields) {
                    const messages =
                        Object.entries(
                            errorBody.fields
                        )
                            .map(
                                ([field, message]) =>
                                    `${field}: ${message}`
                            )
                            .join('\n');

                    alert(messages);

                } else if (
                    errorBody?.message
                ) {
                    alert(
                        errorBody.message
                    );

                } else {
                    alert(
                        `Unable to save employee. HTTP ${response.status}`
                    );
                }

                return;
            }

            const wasEditing =
                Boolean(
                    editing?.id
                );

            setEditing(null);

            await loadEmployees();
            await loadDash();

            alert(
                wasEditing
                    ? 'Employee updated successfully!'
                    : 'Employee added successfully!'
            );

        } catch (error) {
            console.error(
                'Unable to save employee:',
                error
            );

            alert(
                'Unable to connect to the backend.'
            );
        }
    };

    return (
        <div className="app">

            <aside>

                <div className="brand">
                    ACME <span>PayLens</span>
                </div>

                <button
                    className={
                        tab === 'dashboard'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setTab('dashboard')
                    }
                >
                    <LayoutDashboard
                        size={18}
                    />

                    Dashboard
                </button>

                <button
                    className={
                        tab === 'employees'
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setTab('employees')
                    }
                >
                    <Users size={18} />

                    Employees
                </button>

            </aside>

            <main>

                {tab === 'dashboard' ? (

                    <Dashboard
                        summary={summary}
                        deps={deps}
                        loading={dashboardLoading}
                    />

                ) : (

                    <Employees
                        data={employees}
                        loading={employeeLoading}
                        page={page}
                        setPage={setPage}
                        search={search}
                        setSearch={setSearch}
                        department={department}
                        setDepartment={setDepartment}
                        setEditing={setEditing}
                    />

                )}

            </main>

            {editing !== null && (

                <EmployeeModal
                    employee={editing}
                    onClose={() =>
                        setEditing(null)
                    }
                    onSave={save}
                />

            )}

        </div>
    );
}

function Dashboard({
    summary,
    deps,
    loading
}) {
    const sortedDepartments =
        [...deps].sort(
            (a, b) =>
                Number(
                    b.averageSalaryUsd
                ) -
                Number(
                    a.averageSalaryUsd
                )
        );

    const topDepartment =
        sortedDepartments.length > 0
            ? sortedDepartments[0]
            : null;

    return (
        <>

            <section className="dashboard-hero">

                <div>

                    <p className="eyebrow">
                        ACME PAY INTELLIGENCE
                    </p>

                    <h1>
                        Compensation Overview
                    </h1>

                    <p className="hero-subtitle">
                        Understand how ACME compensates
                        its workforce across teams,
                        countries and roles.
                    </p>

                </div>

                <div className="hero-badge">
                    HR Analytics
                </div>

            </section>

            <div className="kpi-grid">

                <div className="kpi-card">

                    <div className="kpi-icon">
                        <Users size={22} />
                    </div>

                    <div>

                        <span>
                            Total Employees
                        </span>

                        <strong>
                            {Number(
                                summary.employeeCount ||
                                0
                            ).toLocaleString()}
                        </strong>

                        <small>
                            Compensation records
                        </small>

                    </div>

                </div>

                <div className="kpi-card">

                    <div className="kpi-icon">
                        <DollarSign size={22} />
                    </div>

                    <div>

                        <span>
                            Average Salary
                        </span>

                        <strong>
                            {money(
                                summary.averageSalaryUsd
                            )}
                        </strong>

                        <small>
                            Organization average
                        </small>

                    </div>

                </div>

                <div className="kpi-card">

                    <div className="kpi-icon">
                        <Building2 size={22} />
                    </div>

                    <div>

                        <span>
                            Total Payroll
                        </span>

                        <strong>
                            {money(
                                summary.totalPayrollUsd
                            )}
                        </strong>

                        <small>
                            Normalized to USD
                        </small>

                    </div>

                </div>

                <div className="kpi-card">

                    <div className="kpi-icon">
                        <DollarSign size={22} />
                    </div>

                    <div>

                        <span>
                            Highest Salary
                        </span>

                        <strong>
                            {money(
                                summary.maximumSalaryUsd
                            )}
                        </strong>

                        <small>
                            Maximum compensation
                        </small>

                    </div>

                </div>

                <div className="kpi-card">

                    <div className="kpi-icon">
                        <DollarSign size={22} />
                    </div>

                    <div>

                        <span>
                            Lowest Salary
                        </span>

                        <strong>
                            {money(
                                summary.minimumSalaryUsd
                            )}
                        </strong>

                        <small>
                            Minimum compensation
                        </small>

                    </div>

                </div>

            </div>

            <div className="dashboard-grid">

                <section className="panel chart-panel">

                    <div className="panel-title-row">

                        <div>

                            <p className="eyebrow">
                                COMPENSATION BENCHMARK
                            </p>

                            <h2>
                                Average Salary by Department
                            </h2>

                            <p>
                                Compare average compensation
                                across ACME departments.
                            </p>

                        </div>

                    </div>

                    {loading ? (

                        <div className="empty-state">
                            Loading analytics...
                        </div>

                    ) : sortedDepartments.length === 0 ? (

                        <div className="empty-state">
                            No department salary data available.
                        </div>

                    ) : (

                        <div className="salary-chart">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={
                                        sortedDepartments
                                    }
                                    layout="vertical"
                                    margin={{
                                        top: 10,
                                        right: 50,
                                        left: 40,
                                        bottom: 10
                                    }}
                                >

                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={
                                            (value) =>
                                                `$${Math.round(
                                                    Number(
                                                        value
                                                    ) /
                                                    1000
                                                )}k`
                                        }
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="department"
                                        width={150}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={
                                            (value) => [
                                                money(
                                                    value
                                                ),
                                                'Average Salary'
                                            ]
                                        }
                                    />

                                    <Bar
                                        dataKey="averageSalaryUsd"
                                        fill="#2563eb"
                                        radius={[
                                            0,
                                            8,
                                            8,
                                            0
                                        ]}
                                        barSize={24}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </section>

                <section className="panel highlight-panel">

                    <p className="eyebrow">
                        TOP COMPENSATION
                    </p>

                    <h2>
                        Highest Paying Department
                    </h2>

                    {topDepartment ? (

                        <>

                            <div className="highlight-value">
                                {
                                    topDepartment.department
                                }
                            </div>

                            <div className="highlight-salary">
                                {money(
                                    topDepartment.averageSalaryUsd
                                )}
                            </div>

                            <p>
                                Average annual salary in USD
                            </p>

                        </>

                    ) : (

                        <p>
                            No department data available.
                        </p>

                    )}

                </section>

            </div>

            {sortedDepartments.length > 0 && (

                <section className="panel">

                    <div className="panel-title-row">

                        <div>

                            <p className="eyebrow">
                                DEPARTMENT SNAPSHOT
                            </p>

                            <h2>
                                Department Compensation
                            </h2>

                            <p>
                                Quick salary comparison
                                across teams.
                            </p>

                        </div>

                    </div>

                    <div className="department-grid">

                        {sortedDepartments.map(
                            (item, index) => (

                                <div
                                    className="department-card"
                                    key={
                                        item.department
                                    }
                                >

                                    <div className="department-card-top">

                                        <div className="department-rank">
                                            {index + 1}
                                        </div>

                                        <span>
                                            {
                                                item.department
                                            }
                                        </span>

                                    </div>

                                    <strong>
                                        {money(
                                            item.averageSalaryUsd
                                        )}
                                    </strong>

                                    <small>
                                        Average salary
                                    </small>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}

        </>
    );
}

function Employees({
    data,
    loading,
    page,
    setPage,
    search,
    setSearch,
    department,
    setDepartment,
    setEditing
}) {
    return (
        <>

            <header>

                <div>

                    <h1>
                        Employees
                    </h1>

                    <p>
                        {Number(
                            data.totalElements ||
                            0
                        ).toLocaleString()}
                        {' '}compensation records
                    </p>

                </div>

                <button
                    className="primary"
                    onClick={() =>
                        setEditing({})
                    }
                >
                    + Add Employee
                </button>

            </header>

            <section className="panel">

                <div className="filters">

                    <div className="search">

                        <Search
                            size={18}
                        />

                        <input
                            placeholder="Search exact employee ID or employee name"
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                        />

                    </div>

                    <select
                        value={department}
                        onChange={(event) => {
                            setDepartment(
                                event.target.value
                            );

                            setPage(0);
                        }}
                    >

                        <option value="">
                            All departments
                        </option>

                        {DEPARTMENTS.map(
                            (item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            )
                        )}

                    </select>

                </div>

                {loading ? (

                    <div className="empty-state">
                        Loading employees...
                    </div>

                ) : data.content.length === 0 ? (

                    <div className="empty-state">
                        No employees found.
                    </div>

                ) : (

                    <>

                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Database ID
                                        </th>

                                        <th>
                                            Employee Number
                                        </th>

                                        <th>
                                            First Name
                                        </th>

                                        <th>
                                            Last Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Job Title
                                        </th>

                                        <th>
                                            Country
                                        </th>

                                        <th>
                                            Local Salary
                                        </th>

                                        <th>
                                            Currency
                                        </th>

                                        <th>
                                            Salary in USD
                                        </th>

                                        <th>
                                            Created At
                                        </th>

                                        <th>
                                            Updated At
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.content.map(
                                        (employee) => (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        employee.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.employeeNumber
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.firstName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.lastName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.email
                                                    }
                                                </td>

                                                <td>

                                                    <span className="pill">

                                                        {
                                                            employee.department
                                                        }

                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        employee.jobTitle
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.country
                                                    }
                                                </td>

                                                <td>
                                                    {Number(
                                                        employee.salaryAmount
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {
                                                        employee.currency
                                                    }
                                                </td>

                                                <td>

                                                    <b>
                                                        {money(
                                                            employee.normalizedSalaryUsd
                                                        )}
                                                    </b>

                                                </td>

                                                <td>
                                                    {employee.createdAt
                                                        ? new Date(
                                                            employee.createdAt
                                                        ).toLocaleString()
                                                        : '-'
                                                    }
                                                </td>

                                                <td>
                                                    {employee.updatedAt
                                                        ? new Date(
                                                            employee.updatedAt
                                                        ).toLocaleString()
                                                        : '-'
                                                    }
                                                </td>

                                                <td>

                                                    <button
                                                        className="edit"
                                                        title="Edit employee"
                                                        onClick={() =>
                                                            setEditing(
                                                                employee
                                                            )
                                                        }
                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                        <div className="pagination">

                            <div>

                                Showing{' '}

                                {page * 100 + 1}

                                {' - '}

                                {Math.min(
                                    (page + 1) * 100,
                                    data.totalElements
                                )}

                                {' of '}

                                {Number(
                                    data.totalElements ||
                                    0
                                ).toLocaleString()}

                            </div>

                            <div className="pagination-buttons">

                                <button
                                    disabled={
                                        page === 0
                                    }
                                    onClick={() =>
                                        setPage(
                                            page - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {page + 1}
                                    {' '}of{' '}
                                    {Math.max(
                                        1,
                                        data.totalPages ||
                                        1
                                    )}
                                </span>

                                <button
                                    disabled={
                                        page + 1 >=
                                        data.totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            page + 1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </>

                )}

            </section>

        </>
    );
}

function EmployeeModal({
    employee,
    onClose,
    onSave
}) {
    const e =
        employee || {};

    const [
        salaryAmount,
        setSalaryAmount
    ] = useState(
        e.salaryAmount ?? ''
    );

    const [
        currency,
        setCurrency
    ] = useState(
        e.currency ?? ''
    );

    const [
        normalizedSalaryUsd,
        setNormalizedSalaryUsd
    ] = useState(
        e.normalizedSalaryUsd ?? ''
    );

    useEffect(() => {
        if (
            salaryAmount === '' ||
            !currency
        ) {
            setNormalizedSalaryUsd('');
            return;
        }

        const rate =
            USD_RATES[currency];

        if (!rate) {
            setNormalizedSalaryUsd('');
            return;
        }

        const converted =
            Number(
                salaryAmount
            ) *
            rate;

        if (
            !Number.isFinite(
                converted
            )
        ) {
            setNormalizedSalaryUsd('');
            return;
        }

        setNormalizedSalaryUsd(
            converted.toFixed(2)
        );

    }, [
        salaryAmount,
        currency
    ]);

    return (
        <div className="modal-bg">

            <form
                className="modal"
                onSubmit={onSave}
            >

                <div className="modal-head">

                    <h2>
                        {e.id
                            ? 'Edit employee'
                            : 'Add employee'
                        }
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="grid">

                    <label>
                        Employee Number

                        <input
                            name="employeeNumber"
                            required
                            defaultValue={
                                e.employeeNumber ??
                                ''
                            }
                            placeholder="ACME-25001"
                        />
                    </label>

                    <label>
                        First Name

                        <input
                            name="firstName"
                            required
                            defaultValue={
                                e.firstName ??
                                ''
                            }
                        />
                    </label>

                    <label>
                        Last Name

                        <input
                            name="lastName"
                            required
                            defaultValue={
                                e.lastName ??
                                ''
                            }
                        />
                    </label>

                    <label>
                        Email

                        <input
                            name="email"
                            type="email"
                            required
                            defaultValue={
                                e.email ??
                                ''
                            }
                            placeholder="employee@acme.com"
                        />
                    </label>

                    <label>
                        Department

                        <select
                            name="department"
                            required
                            defaultValue={
                                e.department ??
                                ''
                            }
                        >

                            <option
                                value=""
                                disabled
                            >
                                Select department
                            </option>

                            {DEPARTMENTS.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </label>

                    <label>
                        Job Title

                        <input
                            name="jobTitle"
                            required
                            defaultValue={
                                e.jobTitle ??
                                ''
                            }
                            placeholder="Software Engineer"
                        />
                    </label>

                    <label>
                        Country

                        <select
                            name="country"
                            required
                            defaultValue={
                                e.country ??
                                ''
                            }
                        >

                            <option
                                value=""
                                disabled
                            >
                                Select country
                            </option>

                            {COUNTRIES.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </label>

                    <label>
                        Local Salary

                        <input
                            name="salaryAmount"
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={salaryAmount}
                            onChange={(event) =>
                                setSalaryAmount(
                                    event.target.value
                                )
                            }
                            placeholder="120000"
                        />
                    </label>

                    <label>
                        Currency

                        <select
                            name="currency"
                            required
                            value={currency}
                            onChange={(event) =>
                                setCurrency(
                                    event.target.value
                                )
                            }
                        >

                            <option
                                value=""
                                disabled
                            >
                                Select currency
                            </option>

                            {CURRENCIES.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </label>

                    <label>
                        Salary in USD

                        <input
                            name="normalizedSalaryUsd"
                            type="number"
                            required
                            readOnly
                            value={
                                normalizedSalaryUsd
                            }
                        />

                        {currency &&
                            salaryAmount && (

                            <small className="fx-note">
                                Automatically calculated:
                                {' '}1 {currency}
                                {' = $'}
                                {USD_RATES[currency]}
                                {' USD'}
                            </small>

                        )}

                    </label>

                </div>

                <div className="actions">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary"
                        type="submit"
                    >
                        {e.id
                            ? 'Update employee'
                            : 'Save employee'
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}

createRoot(
    document.getElementById('root')
).render(
    <App />
);