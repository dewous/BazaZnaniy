import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

type Props = {
  topic: { id: string; title: string };
  subjectId: string;
};

export default function TopicCard({ topic, subjectId }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/subjects/[subjectId]/[topicId]',
          params: { subjectId, topicId: topic.id },
        })
      }
    >
      <Text style={styles.title}>{topic.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 10,
    backgroundColor: '#dff0ff',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
  },
});
