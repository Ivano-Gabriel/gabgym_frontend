// src/components/TodaysLogSidebar.js
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

function TodaysLogSidebar({ log, onClose, onClear, onRemove }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmClear = () => {
        onClear();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}>
                <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
                    <div className="sidebar-header">
                        <h3>Resumo de Hoje</h3>
                        <button onClick={onClose} className="close-sidebar-button">×</button>
                    </div>
                    <div className="sidebar-body">
                        {log.length > 0 ? (
                            log.map((item) => (
                                <div key={item.timestamp} className="log-item">
                                    {/* Lógica para mostrar cada tipo de item */}
                                    {item.type === 'food' && (
                                        <>
                                            <span>{item.name} ({item.serving_desc})</span>
                                            <span style={{ color: 'var(--primaryGreen)' }}>+{item.calories} kcal</span>
                                        </>
                                    )}
                                    {item.type === 'exercise' && (
                                        <>
                                            <span>{item.name}</span>
                                            <span style={{ color: '#e74c3c' }}>{item.calories} kcal</span>
                                        </>
                                    )}
                                    {item.type === 'water' && (
                                        <>
                                            <span>{item.name}</span>
                                            <span style={{ color: '#3498db' }}>+{item.volume} ml</span>
                                        </>
                                    )}
                                    <button onClick={() => onRemove(item.timestamp)} className="remove-food-button">×</button>
                                </div>
                            ))
                        ) : (
                            <p>Você ainda não adicionou nenhum item hoje.</p>
                        )}
                    </div>
                    <div className="sidebar-footer">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="clear-log-button"
                            disabled={log.length === 0}
                        >
                            Limpar Dia
                        </button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <ConfirmationModal
                    title="Confirmar Ação"
                    message="Tem certeza que deseja limpar todos os registros de hoje? Esta ação não pode ser desfeita."
                    onConfirm={handleConfirmClear}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}

export default TodaysLogSidebar;