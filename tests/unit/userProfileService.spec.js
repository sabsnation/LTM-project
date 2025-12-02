import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPatientProfileById } from '@/firebase/userProfileService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';

// Mocking a dependência 'firebase/firestore'
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    doc: vi.fn(),
    getDoc: vi.fn(),
  };
});

// Mocking a dependência '@/firebase/init'
vi.mock('@/firebase/init', () => ({
  db: vi.fn(), // Apenas um mock simples, não precisa de implementação real
}));

describe('userProfileService', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();
  });

  describe('getPatientProfileById', () => {
    it('should throw an error if patientId is not provided', async () => {
      await expect(getPatientProfileById(null)).rejects.toThrow('Patient ID is required');
      await expect(getPatientProfileById(undefined)).rejects.toThrow('Patient ID is required');
    });

    it('should return patient data when document exists', async () => {
      const patientId = 'test-patient-id';
      const patientData = { name: 'John Doe', email: 'john@example.com' };
      const docSnap = {
        exists: () => true,
        data: () => patientData,
        id: patientId,
      };

      // Configura os mocks para simular a resposta do Firestore
      getDoc.mockResolvedValue(docSnap);
      doc.mockReturnValue({}); // O valor de retorno de doc() não importa muito aqui

      const result = await getPatientProfileById(patientId);

      // Verifica se a função doc foi chamada com os argumentos corretos
      expect(doc).toHaveBeenCalledWith(db, 'users', patientId);
      // Verifica se getDoc foi chamada
      expect(getDoc).toHaveBeenCalled();
      // Verifica se o resultado está correto
      expect(result).toEqual({ id: patientId, ...patientData });
    });

    it('should return null when document does not exist', async () => {
      const patientId = 'non-existent-id';
      const docSnap = {
        exists: () => false,
      };

      getDoc.mockResolvedValue(docSnap);

      const result = await getPatientProfileById(patientId);

      expect(doc).toHaveBeenCalledWith(db, 'users', patientId);
      expect(getDoc).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an error if getDoc fails', async () => {
      const patientId = 'test-patient-id';
      const error = new Error('Firestore error');

      getDoc.mockRejectedValue(error);

      await expect(getPatientProfileById(patientId)).rejects.toThrow('Firestore error');

      expect(doc).toHaveBeenCalledWith(db, 'users', patientId);
      expect(getDoc).toHaveBeenCalled();
    });
  });
});
