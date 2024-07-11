<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-button
          type="primary"
          @click="showEdit()"
          v-has="proxy.PermissionCode.carousel.edit"
          >新增轮播图</el-button
        >
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>轮播图列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="carousels"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        :showPagination="false"
      >
        <template #slotImgPath="{ index, row }">
          <Cover :cover="row.appImgUrl" :width="330" :height="180"></Cover>
        </template>
        <template #slotObjectType="{ index, row }">
          {{ OBJECT_TYPE_MAP[row.objectType] }}
        </template>
        <template #slotObject="{ index, row }">
          <div v-if="row.objectType == 3">{{ row.outerLink }}</div>
          <div v-else>{{ row.objectId }}</div>
        </template>
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="changeSort(index, 'up')"
              v-has="proxy.PermissionCode.carousel.edit"
              :class="[index == 0 ? 'not-allow' : 'a-link']"
              >上移</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="changeSort(index, 'down')"
              v-has="proxy.PermissionCode.carousel.edit"
              :class="[
                tableData.list.length - 1 == index ? 'not-allow' : 'a-link',
              ]"
              >下移</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.carousel.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delCategory(row)"
              v-has="proxy.PermissionCode.carousel.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <CarouselEdit ref="CarouselEditRef" @reload="loadDataList"></CarouselEdit>
  </div>
</template>

<script setup>
import CarouselEdit from "./CarouselEdit.vue";
import { OBJECT_TYPE_MAP } from "@/utils/Constants";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadCarousel: "/carousel/loadDataList",
  saveCarousel: "/carousel/saveCarousel",
  delCarousel: "/carousel/delCarousel",
  changeSort: "/carousel/changeSort",
};

const tableData = ref({});
const tableOptions = ref({
  extHeight: 125,
});

const carousels = [
  { label: "轮播图", prop: "appImgUrl", scopedSlots: "slotImgPath" },
  { label: "类型", prop: "objectType", scopedSlots: "slotObjectType" },
  { label: "主体ID/链接", prop: "object", scopedSlots: "slotObject" },
  {
    label: "操作",
    prop: "operation",
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadCarousel,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result.data);
};

// 删除轮播图
const delCategory = (data) => {
  proxy.Confirm(`确定要删除吗？`, async () => {
    let result = await proxy.Request({
      url: api.delCarousel,
      params: {
        carouselId: data.carouselId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

// 上移下移
const changeSort = async (index, type) => {
  let dataList = tableData.value.list;
  if (
    (type == "down" && index == dataList.length - 1) ||
    (type == "up" && index == 0)
  ) {
    return; // 最上的不能上移 最下的不能下移
  }
  let temp = dataList[index];
  let number = type == "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  let carouselIds = [];
  dataList.forEach((el) => {
    carouselIds.push(el.carouselId);
  });
  let result = await proxy.Request({
    url: api.changeSort,
    params: {
      carouselIds: carouselIds.join(","),
    },
  });
  if (!result) {
    return;
  }
  proxy.Message.success("移动成功!");
  loadDataList();
};

const CarouselEditRef = ref();
const showEdit = (data = {}) => {
  CarouselEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}

.right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 18px;
}

.text-red {
  color: red;
  cursor: pointer;
}
.text-green {
  color: green;
  cursor: pointer;
}
</style>
