import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

type Props = {
  subject: { id: string; name: string };
};

export default function SubjectCard({ subject }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/subjects/[subjectId]/index',
          params: { subjectId: subject.id },
        })
      }
    >
      <Text style={styles.title}>{subject.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
});
