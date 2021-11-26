import { Button } from "@chakra-ui/button";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import { IEvent } from "../global.types";
import { formatTime } from "../utils";

interface ISingleEventProps extends IEvent {
  onPlay: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export const SingleEvent = ({
  name,
  duration,
  status,
  onPlay,
  onStop,
  onDelete,
}: ISingleEventProps) => (
  <Flex
    shadow="md"
    p="4"
    flexDir="column"
    background="blue.50"
    borderRadius="4px"
    border="2px solid"
    borderColor={status === "playing" ? "blue.400" : "transparent"}
  >
    <Heading
      as="h3"
      textAlign="center"
      mb="4"
      size="lg"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      title={name}
    >
      {name}
    </Heading>
    <Text size="md" textAlign="center" mb="4">
      {formatTime(duration)}
    </Text>
    <Flex flexWrap="wrap">
      <Button
        size="sm"
        disabled={status === "playing"}
        onClick={onPlay}
        colorScheme="blue"
      >
        Play
      </Button>
      <Button
        ml="2"
        size="sm"
        disabled={status === "stopped"}
        onClick={onStop}
        colorScheme="blue"
      >
        Stop
      </Button>
      <Button
        ml="auto"
        size="sm"
        disabled={status === "playing"}
        onClick={onDelete}
        colorScheme="red"
        variant="outline"
      >
        Delete
      </Button>
    </Flex>
  </Flex>
);
