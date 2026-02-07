import { useState, useEffect, use } from 'react';
import { bpartnerService } from '../services/api';

function BPartnerForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        value: '',
        name: '',
        taxid: '',
        groupId: '',
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoadingGroups(true);
            const response = await bpartnerService.getGroups();
            setGroups(response.data);
        } catch (error) {
            setError('Error al cargar grupos: ' + (error.message || 'Error desconocido'));
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.value.trim()) {
            errors.value = 'El código es obligatorio';
        }

        if (!formData.name.trim()) {
            errors.name = 'El nombre es obligatorio';
        }

        if (!formData.taxid.trim()) {
            errors.taxid = 'El RUC/Cédula es obligatorio';
        } else if (!/^\d+$/.test(formData.taxId)) {
            errors.taxId = 'La identificación solo debe contener números';
        } else if (formData.taxId.length !== 10 && formData.taxId.length !== 13) {
            errors.taxId = 'Debe tener 10 dígitos (Cédula) o 13 dígitos (RUC)';
        }

        if (!formData.groupId) {
            errors.groupId = 'Debe seleccionar un grupo';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await bpartnerService.create(formData);

            setSuccess(`Tercero creado con exito: ${response.data.name}`);
            setFormData({
                value: '',
                name: '',
                taxId: '',
                groupId: '',
            });

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'Error creando el tercero');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            value: '',
            name: '',
            taxId: '',
            groupId: '',
        });
        setValidationErrors({});
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">
                Registrar Nuevo Tercero
            </h2>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <span>✓</span>
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="value"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.value
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Ej: CLIE001"
                            value={formData.value}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {validationErrors.value && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.value}</p>
                        )}
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.name
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Ej: Juan Pérez"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {validationErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Identificación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            RUC / Cédula <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="taxId"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.taxId
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="10 dígitos (Cédula) o 13 dígitos (RUC)"
                            value={formData.taxId}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength="13"
                        />
                        {validationErrors.taxId && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.taxId}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            Se validará el formato de RUC/Cédula ecuatoriana
                        </p>
                    </div>

                    {/* Grupo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grupo de Tercero <span className="text-red-500">*</span>
                        </label>
                        {loadingGroups ? (
                            <div className="text-gray-500 py-2">Cargando grupos...</div>
                        ) : (
                            <select
                                name="groupId"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.groupId
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                value={formData.groupId}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Seleccione un grupo</option>
                                {groups.map((group) => (
                                    <option key={group.ID} value={group.ID}>
                                        {group.NAME} {group.DESCRIPTION ? `- ${group.DESCRIPTION}` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                        {validationErrors.groupId && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.groupId}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || loadingGroups}
                        >
                            {loading ? '⏳ Guardando...' : '💾 Guardar Tercero'}
                        </button>

                        {!loading && (
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                onClick={handleClear}
                            >
                                🔄 Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default BPartnerForm;