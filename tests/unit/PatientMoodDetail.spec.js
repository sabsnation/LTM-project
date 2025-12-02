import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import PatientMoodDetail from '@/views/PatientMoodDetail.vue';

// Mock do vue-router
const mockPush = vi.fn();
const mockUseRouter = {
  push: mockPush,
};

vi.mock('vue-router', async () => ({
  ...await vi.importActual('vue-router'),
  useRoute: () => ({
    params: { id: 'test-patient-id' },
  }),
  useRouter: () => mockUseRouter,
}));

// Mock do userProfileService
import { getPatientProfileById } from '@/firebase/userProfileService';
vi.mock('@/firebase/userProfileService', () => ({
  getPatientProfileById: vi.fn(),
}));

describe('PatientMoodDetail.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading message initially', () => {
    getPatientProfileById.mockResolvedValueOnce(new Promise(() => {})); // Promise que nunca resolve
    const wrapper = mount(PatientMoodDetail);
    expect(wrapper.text()).toContain('Carregando dados do paciente...');
  });

  it('fetches and displays patient data on mount', async () => {
    const patientData = {
      id: 'test-patient-id',
      name: 'Maria Silva',
      moodHistory: [
        { mood: 'Feliz', date: { toDate: () => new Date('2023-10-27T10:00:00Z') }, comment: 'Tive um ótimo dia!' },
        { mood: 'Normal', date: { toDate: () => new Date('2023-10-26T10:00:00Z') } },
      ],
    };
    getPatientProfileById.mockResolvedValue(patientData);

    const wrapper = mount(PatientMoodDetail);

    await nextTick(); // Espera a promise resolver e o DOM atualizar
    await nextTick(); // Mais um para garantir

    expect(getPatientProfileById).toHaveBeenCalledWith('test-patient-id');
    expect(wrapper.find('h1').text()).toBe('Maria Silva');
    expect(wrapper.text()).toContain('Histórico de Humor');
    expect(wrapper.findAll('.space-y-4 > div').length).toBe(2);
    expect(wrapper.text()).toContain('Humor: Feliz');
    expect(wrapper.text()).toContain('Data: 27 de outubro de 2023');
    expect(wrapper.text()).toContain('Comentário: Tive um ótimo dia!');
    expect(wrapper.text()).toContain('Humor: Normal');
  });

  it('displays a message when there is no mood history', async () => {
    const patientData = {
      id: 'test-patient-id',
      name: 'João Souza',
      moodHistory: [],
    };
    getPatientProfileById.mockResolvedValue(patientData);

    const wrapper = mount(PatientMoodDetail);
    await nextTick();
    await nextTick();


    expect(wrapper.text()).toContain('Nenhum histórico de humor encontrado para este paciente.');
  });
  
    it('displays a message when mood history is null or undefined', async () => {
    const patientData = {
      id: 'test-patient-id',
      name: 'João Souza',
      moodHistory: null, // Testando com null
    };
    getPatientProfileById.mockResolvedValue(patientData);

    const wrapper = mount(PatientMoodDetail);
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain('Nenhum histórico de humor encontrado para este paciente.');
    
    // Testando com undefined
    patientData.moodHistory = undefined;
    getPatientProfileById.mockResolvedValue(patientData);
    const wrapper2 = mount(PatientMoodDetail);
    await nextTick();
    await nextTick();
    
    expect(wrapper2.text()).toContain('Nenhum histórico de humor encontrado para este paciente.');
  });


  it('calls router.push when the back button is clicked', async () => {
    const patientData = { id: 'test-patient-id', name: 'Maria Silva', moodHistory: [] };
    getPatientProfileById.mockResolvedValue(patientData);

    const wrapper = mount(PatientMoodDetail);
    await nextTick();
    await nextTick(); // Adicionar este segundo nextTick

    await wrapper.find('button').trigger('click');

    expect(mockPush).toHaveBeenCalledWith({ name: 'psychologist-dashboard' });
  });

  it('handles error when fetching patient data', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to fetch');
    getPatientProfileById.mockRejectedValue(error);

    const wrapper = mount(PatientMoodDetail);
    await nextTick();

    expect(getPatientProfileById).toHaveBeenCalledWith('test-patient-id');
    expect(wrapper.text()).toContain('Carregando dados do paciente...'); // Deveria continuar mostrando loading ou uma mensagem de erro
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar perfil do paciente:', error);
    
    consoleErrorSpy.mockRestore();
  });
});
