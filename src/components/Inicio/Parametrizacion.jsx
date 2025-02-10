import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import Navbar from './Navbar';


export default function Parametrizacion() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: "contains" },
        name: { value: null, matchMode: "startsWith" },
        "country.name": { value: null, matchMode: "startsWith" },
        representative: { value: null, matchMode: "in" },
        status: { value: null, matchMode: "equals" },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Aquí puedes usar tus datos mock o la llamada a tu API
        setCustomers(mockCustomers); // Simulate loading customer data
        setLoading(false);
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => (
        <div className="text-center mb-4 my-4">
            <h1 className="text-white text-4xl font-bold">Bienvenido a parametrización</h1>
            <div className="flex justify-center items-center mt-4">
                <div className="flex justify-between items-center w-full max-w-6xl">
                    <div className="flex gap-4">
                        <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-900">
                            <Button
                                label="Agregar medición"
                                className="p-button-sm w-full text-white"
                            />
                        </div>
                        <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-900">
                            <Button
                                label="Agregar servidor"
                                className="p-button-sm w-full text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-48">
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Buscar servidor"
                            className="p-inputtext-sm p-shadow-2 rounded-lg w-full p-2"
                            aria-label="Global search"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const statusBodyTemplate = (rowData) => (
        <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );

    const getSeverity = (status) => {
        switch (status) {
            case "unqualified":
                return "danger";
            case "qualified":
                return "success";
            case "new":
                return "info";
            case "negotiation":
                return "warning";
            case "renewal":
                return null;
            default:
                return null;
        }
    };

    const renderCheckboxList = () => {
        return (
            <div className="my-4">
                {selectedCustomers.length > 0 && (
                    <Button
                        label="Guardar cambios"
                        className="p-button-lg w-full mt-4"
                        onClick={() => alert('Cambios guardados!')}
                    />
                )}
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-black via-purple-800 to-black opacity-95">
                <Navbar />
                <div className="card mt-28 mx-auto max-w-7xl shadow-xl p-6 rounded-lg bg-transparent">
                    <DataTable
                        value={customers}
                        paginator
                        rows={10}
                        dataKey="id"
                        selectionMode="checkbox"
                        selection={selectedCustomers}
                        onSelectionChange={(e) => setSelectedCustomers(e.value)}
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={["name", "country.name", "representative.name", "status"]}
                        loading={loading}
                        header={renderHeader()}
                        emptyMessage="No customers found."
                        responsiveLayout="scroll"
                        className="p-datatable-sm"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: "12rem" }} />
                        <Column header="Country" filterField="country.name" body={countryBodyTemplate} filter filterPlaceholder="Search by country" style={{ minWidth: "12rem" }} />
                        <Column header="Representative" filterField="representative" body={representativeBodyTemplate} filter filterPlaceholder="Search by representative" style={{ minWidth: "14rem" }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} filter style={{ minWidth: "12rem" }} />
                    </DataTable>
                    {renderCheckboxList()}
                </div>
            </div>
        </>
    );
}
