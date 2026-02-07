import { useState, useEffect } from 'react';
import { bpartnerService } from '../services/api';

function BPartnerList({ refreshTrigger }) {
    const [bpartners, setBpartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBPartners();
    }, [refreshTrigger]);

    const fetchBPartners = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bpartnerService.getAll(search);
            setBpartners(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching business partners');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBPartners(searchTerm);
    };

    const handleSearchChange = () => {
        setSearchTerm('');
        fetchBPartners('');
    };

    if (loading) {
        return (
            <div className="gb-white rounded-lg shadow p-6">
                <div className='flex justify-center items-center py-8'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
                📋 Listado de Terceros
            </h2>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6 flex-wrap">
                <input
                    type="text"
                    className="flex-1 min-w-50 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar por nombre o RUC/Cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    🔍 Buscar
                </button>
                {searchTerm && (
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        onClick={handleSearchChange}
                    >
                        Limpiar
                    </button>
                )}
            </form>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <span>{error}</span>
                </div>
            )}

            {bpartners.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    No se encontraron terceros
                </p>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-3">
                        {bpartners.length} tercero{bpartners.length !== 1 ? 's' : ''} encontrado{bpartners.length !== 1 ? 's' : ''}
                    </p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        RUC/Cédula
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grupo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bpartners.map((bp) => (
                                    <tr key={bp.C_BPARTNER_ID} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {bp.CODE}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {bp.NAME}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {bp.TAXID || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bp.GROUP_NAME || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default BPartnerList;