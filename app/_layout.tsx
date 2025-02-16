import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Para ícones
import axios from "axios";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definindo as cores da paleta do Figma
const colors = {
  bluePrimary: "#0500FF", // Azul Primário
  black: "#1C1C1C", // Preto Neutro
  gray20: "#9E9E9E", // Cinza 20
  gray10: "#F2F2F2", // Cinza 10
  gray05: "#F9F9F9", // Cinza 05
  white: "#FFFFFF", // Branco Neutro
};

interface Employee {
  id: number;
  name: string;
  position: string;
  admissionDate: string;
  phone: string;
  image: string;
}

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
const EXPO_PUBLIC_API_URL_EXPO_EMU = process.env.EXPO_PUBLIC_API_URL_EXPO_EMU;

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2); // Número de notificações não lidas
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(
    null
  ); // Estado para controlar o dropdown

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = EXPO_PUBLIC_API_URL_EXPO_EMU || EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined");
      }
      const response = await axios.get(apiUrl);
      const mappedData = response.data.map((employee: any) => ({
        id: employee.id,
        name: employee.name,
        position: employee.job,
        admissionDate: employee.admission_date,
        phone: employee.phone,
        image: employee.image,
      }));
      setEmployees(mappedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar os dados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone.includes(searchQuery)
  );

  const formatDate = (dateString: string): string => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  const toggleDropdown = (id: number) => {
    setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
  };

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.bluePrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Recarregar" onPress={fetchData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra Superior */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>CG</Text>
          </View>
        </View>
        <Text style={styles.title}>Funcionários</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationIcon}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.white}
            />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={colors.gray20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor={colors.gray20}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      {/* Lista de Funcionários */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
              <View style={styles.employeeHeader}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.employeeImage}
                />
                <View style={styles.employeeDetails}>
                  <Text style={styles.employeeName}>{item.name}</Text>
                </View>
                <MaterialIcons
                  name={
                    expandedEmployeeId === item.id
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color={colors.gray20}
                />
              </View>
            </TouchableOpacity>
            {expandedEmployeeId === item.id && (
              <View style={styles.dropdownContent}>
                <View style={styles.employeeInfoContainer}>
                  <MaterialIcons name="work" size={16} color={colors.gray20} />
                  <Text style={styles.employeeInfo}>{item.position}</Text>
                </View>
                <View style={styles.employeeInfoContainer}>
                  <MaterialIcons
                    name="calendar-today"
                    size={16}
                    color={colors.gray20}
                  />
                  <Text style={styles.employeeInfo}>
                    {item.admissionDate
                      ? formatDate(item.admissionDate)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.employeeInfoContainer}>
                  <MaterialIcons name="phone" size={16} color={colors.gray20} />
                  <Text style={styles.employeeInfo}>
                    {item.phone ? formatPhone(item.phone) : "N/A"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      />

      {/* Modal de Detalhes */}
      {selectedEmployee && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <MaterialIcons name="close" size={24} color={colors.gray20} />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedEmployee.image }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedEmployee.name}</Text>
              <Text style={styles.modalText}>{selectedEmployee.position}</Text>
              <View style={styles.modalInfoContainer}>
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={colors.gray20}
                />
                <Text style={styles.modalText}>
                  {formatDate(selectedEmployee.admissionDate)}
                </Text>
              </View>
              <View style={styles.modalInfoContainer}>
                <MaterialIcons name="phone" size={16} color={colors.gray20} />
                <Text style={styles.modalText}>
                  {formatPhone(selectedEmployee.phone)}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.bluePrimary,
    padding: 16,
    paddingTop: 40,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationIcon: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.bluePrimary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: colors.black,
  },
  employeeCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: colors.gray20,
    marginBottom: 8,
  },
  dropdownContent: {
    marginTop: 8,
  },
  employeeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  employeeInfo: {
    fontSize: 14,
    color: colors.gray20,
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: colors.gray20,
    marginBottom: 8,
  },
  modalInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
